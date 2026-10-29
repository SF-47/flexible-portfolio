using backend.DTOs.SiteSettings;

namespace backend.Services.SiteSettings;

public interface ISiteSettingsService
{
    Task<SiteSettingsResponse?> GetAsync();
    Task<ServiceResult<SiteSettingsResponse>> UpdateBrandAsync(UpdateBrandRequest request);
}
