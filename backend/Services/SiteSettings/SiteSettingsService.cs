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

    // Updates only the company name, logo and footer description.
    public async Task<ServiceResult<SiteSettingsResponse>> UpdateBrandAsync(
        UpdateBrandRequest request
    )
    {
        var settings = await _context.SiteSettings.FirstOrDefaultAsync();

        if (settings is null)
        {
            return ServiceResult<SiteSettingsResponse>.NotFound(
                "Site settings have not been configured."
            );
        }

        var name = request.CompanyName?.Trim() ?? "";

        if (name.Length == 0 || name.Length > 150)
        {
            return ServiceResult<SiteSettingsResponse>.BadRequest(
                "The company name is required (up to 150 characters)."
            );
        }

        var footer = request.FooterDescription?.Trim();

        if (footer is { Length: > 500 })
        {
            return ServiceResult<SiteSettingsResponse>.BadRequest(
                "The footer description can be up to 500 characters."
            );
        }

        if (request.LogoMediaId is not null)
        {
            var logoExists = await _context.MediaAssets.AnyAsync(m => m.Id == request.LogoMediaId);

            if (!logoExists)
            {
                return ServiceResult<SiteSettingsResponse>.BadRequest(
                    "The selected logo does not exist in the Media Library."
                );
            }
        }

        settings.CompanyName = name;
        settings.LogoMediaId = request.LogoMediaId;
        settings.FooterDescription = string.IsNullOrEmpty(footer) ? null : footer;
        settings.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        var updated = await GetAsync();

        return ServiceResult<SiteSettingsResponse>.Ok(updated!);
    }
}
