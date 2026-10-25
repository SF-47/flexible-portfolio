using backend.Data;
using backend.DTOs.Sections;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Sections;

public class SectionService : ISectionService
{
    private readonly AppDbContext _db;

    public SectionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<SectionResponse>> GetAllAsync()
    {
        return await _db
            .Sections.AsNoTracking()
            .OrderBy(s => s.SortOrder)
            .Select(s => new SectionResponse(
                s.Id,
                s.Type,
                s.Name,
                s.Variant,
                s.SortOrder,
                s.IsVisible,
                s.NavLabel,
                s.ContentJson,
                s.SettingsJson,
                s.UpdatedAt
            ))
            .ToListAsync();
    }

    public async Task<List<SectionResponse>> GetVisibleAsync()
    {
        return await _db
            .Sections.AsNoTracking()
            .Where(s => s.IsVisible)
            .OrderBy(s => s.SortOrder)
            .Select(s => new SectionResponse(
                s.Id,
                s.Type,
                s.Name,
                s.Variant,
                s.SortOrder,
                s.IsVisible,
                s.NavLabel,
                s.ContentJson,
                s.SettingsJson,
                s.UpdatedAt
            ))
            .ToListAsync();
    }

    public async Task<SectionResponse?> GetByIdAsync(Guid id)
    {
        return await _db
            .Sections.AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new SectionResponse(
                s.Id,
                s.Type,
                s.Name,
                s.Variant,
                s.SortOrder,
                s.IsVisible,
                s.NavLabel,
                s.ContentJson,
                s.SettingsJson,
                s.UpdatedAt
            ))
            .FirstOrDefaultAsync();
    }

    public async Task<bool> ReorderAsync(List<Guid> sectionIds)
    {
        if (sectionIds is null || sectionIds.Count == 0)
            return false;

        // Duplicate IDs are not allowed.
        if (sectionIds.Count != sectionIds.Distinct().Count())
            return false;

        // Load every section, including hidden sections.
        var sections = await _db.Sections.ToListAsync();

        // The request must contain every database section exactly once.
        if (sectionIds.Count != sections.Count)
            return false;

        var sectionsById = sections.ToDictionary(s => s.Id);

        // Reject unknown IDs before changing anything.
        if (sectionIds.Any(id => !sectionsById.ContainsKey(id)))
            return false;

        // Update each section's order, starting at 1.
        int order = 1;

        foreach (var sectionId in sectionIds)
        {
            var section = sectionsById[sectionId];
            section.SortOrder = order++;
        }

        // EF Core saves the tracked changes together.
        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateLayoutAsync(List<SectionLayoutItem> items)
    {
        if (items is null || items.Count == 0)
            return false;

        // Duplicate IDs are not allowed.
        if (items.Count != items.Select(i => i.Id).Distinct().Count())
            return false;

        // Load every section, including hidden sections.
        var sections = await _db.Sections.ToListAsync();

        // The request must contain every database section exactly once.
        if (items.Count != sections.Count)
            return false;

        var sectionsById = sections.ToDictionary(s => s.Id);

        // Reject unknown IDs before changing anything.
        if (items.Any(item => !sectionsById.ContainsKey(item.Id)))
            return false;

        // Order starts at 1; only the order and visibility change.
        int order = 1;

        foreach (var item in items)
        {
            var section = sectionsById[item.Id];

            section.SortOrder = order++;
            section.IsVisible = item.IsVisible;
            section.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        return true;
    }

    public async Task<UpdateContentResult> UpdateContentAsync(
        Guid id,
        UpdateSectionContentRequest request
    )
    {
        var section = await _db.Sections.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id);

        if (section is null)
            return new UpdateContentResult(UpdateContentStatus.NotFound, "Section not found.");

        JsonObject? submitted;
        JsonObject? stored;
        try
        {
            submitted = JsonNode.Parse(request.ContentJson ?? "") as JsonObject;
            stored = JsonNode.Parse(section.ContentJson) as JsonObject;
        }
        catch (JsonException)
        {
            return Invalid("Content must be a valid JSON object.");
        }

        if (submitted is null || stored is null)
            return Invalid("Content must be a valid JSON object.");

        // Copy only the properties this section type defines onto the stored JSON;
        // anything else already stored stays exactly as it is.
        foreach (var key in SectionContentValidator.Keys(section.Type))
        {
            if (submitted.TryGetPropertyValue(key, out var value))
                stored[key] = value?.DeepClone();
        }

        var mediaIds = new List<int>();
        using var document = JsonDocument.Parse(stored.ToJsonString());
        var error = SectionContentValidator.Validate(section.Type, document.RootElement, mediaIds);

        if (error is not null)
            return Invalid(error);

        var distinctIds = mediaIds.Distinct().ToList();
        var existing = await _db.MediaAssets.CountAsync(m => distinctIds.Contains(m.Id));

        if (existing != distinctIds.Count)
            return Invalid("An image in this content does not exist in the Media Library.");

        // Fast stale check. MySQL keeps microseconds, so compare at that precision.
        if (!SameInstant(request.ExpectedUpdatedAt, section.UpdatedAt))
            return Conflict();

        var newContent = stored.ToJsonString();
        var newUpdatedAt = DateTime.UtcNow;

        // Atomic compare-and-set: the UPDATE only matches if UpdatedAt is still the
        // value we read, so a concurrent save makes it affect 0 rows.
        var rows = await _db
            .Sections.Where(s => s.Id == id && s.UpdatedAt == section.UpdatedAt)
            .ExecuteUpdateAsync(setters =>
                setters
                    .SetProperty(s => s.ContentJson, newContent)
                    .SetProperty(s => s.UpdatedAt, newUpdatedAt)
            );

        if (rows == 0)
            return Conflict();

        // Read back so the returned timestamp is exactly what MySQL stored.
        var saved = await _db
            .Sections.AsNoTracking()
            .Where(s => s.Id == id)
            .Select(s => new UpdateSectionContentResponse(s.ContentJson, s.UpdatedAt))
            .FirstAsync();

        return new UpdateContentResult(UpdateContentStatus.Success, Saved: saved);
    }

    private static UpdateContentResult Conflict() =>
        new(
            UpdateContentStatus.Conflict,
            "This section was changed after you loaded it. Reload the page and try again."
        );

    // MySQL returns UpdatedAt without a "Z" (Kind Unspecified); treat it as UTC.
    private static DateTime AsUtc(DateTime value) =>
        value.Kind == DateTimeKind.Local
            ? value.ToUniversalTime()
            : DateTime.SpecifyKind(value, DateTimeKind.Utc);

    private static bool SameInstant(DateTime a, DateTime b) =>
        Math.Abs((AsUtc(a) - AsUtc(b)).Ticks) < 10;

    private static UpdateContentResult Invalid(string message) =>
        new(UpdateContentStatus.Invalid, message);
}
