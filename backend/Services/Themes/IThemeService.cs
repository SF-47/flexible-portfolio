using backend.DTOs.Themes;

namespace backend.Services.Themes;

public interface IThemeService
{
    Task<List<ThemeResponse>> GetAllAsync();

    Task<ThemeResponse?> GetActiveAsync();

    Task<ThemeResponse?> UpdateAsync(int id, UpdateThemeRequest request);

    Task<ThemeResponse?> ActivateAsync(int id);
}
