using backend.DTOs.SocialLinks;

namespace backend.Services.SocialLinks;

public interface ISocialLinkService
{
    Task<List<SocialLinkResponse>> GetVisibleAsync();
    Task<List<AdminSocialLinkResponse>> GetAllAsync();
    Task<ServiceResult<List<AdminSocialLinkResponse>>> ReplaceAsync(
        UpdateSocialLinksRequest request
    );
}
