using backend.DTOs.Navigation;

namespace backend.Services.Navigation;

public interface INavigationService
{
    Task<List<NavigationResponse>> GetVisibleAsync();
}
