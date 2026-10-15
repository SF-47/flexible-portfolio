using backend.Data;
using backend.DTOs.SocialLinks;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.SocialLinks;

public class SocialLinkService : ISocialLinkService
{
    private readonly AppDbContext _context;

    public SocialLinkService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SocialLinkResponse>> GetVisibleAsync()
    {
        return await _context
            .SocialLinks.AsNoTracking()
            .Where(link => link.IsVisible)
            .OrderBy(link => link.SortOrder)
            .Select(link => new SocialLinkResponse(link.Id, link.Platform, link.Url, link.SortOrder))
            .ToListAsync();
    }
}
