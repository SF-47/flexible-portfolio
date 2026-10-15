using backend.DTOs.Themes;

namespace backend.Services.Themes;

public interface IThemeService
{
    Task<List<ThemeResponse>> GetAllAsync();
    Task<ThemeResponse?> GetActiveAsync();
}
