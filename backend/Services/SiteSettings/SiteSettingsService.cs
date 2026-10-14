using backend.Data;
using backend.DTOs.SiteSettings;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.SiteSettings;

public class SiteSettingsService : ISiteSettingsService
{
    private readonly AppDbContext _context;

    public SiteSettingsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<SiteSettingsResponse?> GetAsync()
    {
        return await _context
            .SiteSettings.AsNoTracking()
            .Select(settings => new SiteSettingsResponse(
                settings.Id,
                settings.CompanyName,
                settings.Tagline,
                settings.Description,
                settings.Email,
                settings.Phone,
                settings.Address,
                settings.LogoMediaId,
                settings.FaviconMediaId,
                settings.FooterDescription,
                settings.SeoTitle,
                settings.SeoDescription
            ))
            .FirstOrDefaultAsync();
    }
}
