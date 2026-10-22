using backend.Data;
using System.Text.Json;
using backend.DTOs.Sections;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Sections;

public class SectionService : ISectionService
{
    // Matches the 100,000 character limit the live preview accepts.
    private const int MaxContentLength = 100_000;

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

    // Returns null when the section does not exist. Throws ArgumentException for
    // invalid content and InvalidOperationException when the section changed since
    // the editor loaded it. Only ContentJson and UpdatedAt are written.
    public async Task<SectionResponse?> UpdateContentAsync(
        Guid id,
        string contentJson,
        DateTime? expectedUpdatedAt
    )
    {
        var section = await _db.Sections.FirstOrDefaultAsync(s => s.Id == id);

        if (section is null)
            return null;

        if (string.IsNullOrWhiteSpace(contentJson) || contentJson.Length > MaxContentLength)
            throw new ArgumentException(
                $"Content is required and must be at most {MaxContentLength} characters."
            );

        JsonDocument document;

        try
        {
            document = JsonDocument.Parse(contentJson);
        }
        catch (JsonException)
        {
            throw new ArgumentException("Content is not valid JSON.");
        }

        string normalizedJson;
        var mediaIds = new List<int>();

        using (document)
        {
            var root = document.RootElement;

            if (root.ValueKind != JsonValueKind.Object)
                throw new ArgumentException("Content must be a JSON object.");

            var error = SectionContentValidator.Validate(section.Type, root, mediaIds);

            if (error is not null)
                throw new ArgumentException(error);

            normalizedJson = root.GetRawText();
        }

        var distinctMediaIds = mediaIds.Distinct().ToList();

        if (distinctMediaIds.Count > 0)
        {
            var found = await _db.MediaAssets.CountAsync(m => distinctMediaIds.Contains(m.Id));

            if (found != distinctMediaIds.Count)
                throw new ArgumentException("A selected image no longer exists.");
        }

        if (
            expectedUpdatedAt is not null
            && expectedUpdatedAt.Value.Ticks != section.UpdatedAt.Ticks
        )
            throw new InvalidOperationException(
                "This section was changed elsewhere. Reload the page to see the latest version."
            );

        // MySQL keeps microseconds, so drop the extra ticks to match what is stored.
        var now = DateTime.UtcNow;

        section.ContentJson = normalizedJson;
        section.UpdatedAt = new DateTime(now.Ticks - now.Ticks % 10, DateTimeKind.Utc);

        await _db.SaveChangesAsync();

        return new SectionResponse(
            section.Id,
            section.Type,
            section.Name,
            section.Variant,
            section.SortOrder,
            section.IsVisible,
            section.NavLabel,
            section.ContentJson,
            section.SettingsJson,
            section.UpdatedAt
        );
    }
}
