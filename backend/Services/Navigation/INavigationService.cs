using backend.DTOs.Navigation;

namespace backend.Services.Navigation;

public interface INavigationService
{
    Task<List<NavigationResponse>> GetVisibleAsync();
    Task<List<AdminNavigationItemResponse>> GetAllAsync();
    Task<ServiceResult<List<AdminNavigationItemResponse>>> ReplaceAsync(
        UpdateNavigationRequest request
    );
}
