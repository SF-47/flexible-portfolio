using backend.DTOs.SocialLinks;

namespace backend.Services.SocialLinks;

public interface ISocialLinkService
{
    Task<List<SocialLinkResponse>> GetVisibleAsync();
}
