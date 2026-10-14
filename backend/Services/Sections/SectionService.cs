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
}
