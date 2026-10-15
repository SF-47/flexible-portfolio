using backend.Data;
using backend.DTOs.Navigation;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Navigation;

public class NavigationService : INavigationService
{
    private readonly AppDbContext _context;

    public NavigationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<NavigationResponse>> GetVisibleAsync()
    {
        return await _context
            .NavigationItems.AsNoTracking()
            .Where(item => item.IsVisible)
            .Where(item => item.SectionId == null || item.Section!.IsVisible)
            .OrderBy(item => item.SortOrder)
            .Select(item => new NavigationResponse(
                item.Id,
                item.Label,
                item.LinkType,
                item.SectionId,
                item.Section != null ? item.Section.Type : null,
                item.Url,
                item.SortOrder,
                item.OpenInNewTab
            ))
            .ToListAsync();
    }
}
