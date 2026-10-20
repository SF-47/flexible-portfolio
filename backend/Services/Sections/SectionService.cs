using backend.Data;
using backend.DTOs.Sections;
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
                s.SettingsJson
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
                s.SettingsJson
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
                s.SettingsJson
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
}
