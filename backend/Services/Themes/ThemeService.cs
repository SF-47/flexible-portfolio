using System.Linq.Expressions;
using backend.Data;
using backend.DTOs.Themes;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Themes;

public class ThemeService : IThemeService
{
    private readonly AppDbContext _context;

    public ThemeService(AppDbContext context)
    {
        _context = context;
    }

    private static readonly Expression<Func<Theme, ThemeResponse>> ThemeProjection =
        theme => new ThemeResponse(
            theme.Id,
            theme.Name,
            theme.PrimaryColor,
            theme.AccentColor,
            theme.BackgroundColor,
            theme.TextColor,
            theme.OnPrimaryColor,
            theme.OnAccentColor,
            theme.HeadingFont,
            theme.BodyFont,
            theme.NavbarVariant,
            theme.IsActive
        );

    public async Task<List<ThemeResponse>> GetAllAsync()
    {
        return await _context
            .Themes.AsNoTracking()
            .OrderBy(theme => theme.Id)
            .Select(ThemeProjection)
            .ToListAsync();
    }

    public async Task<ThemeResponse?> GetActiveAsync()
    {
        return await _context
            .Themes.AsNoTracking()
            .Where(theme => theme.IsActive)
            .OrderBy(theme => theme.Id)
            .Select(ThemeProjection)
            .FirstOrDefaultAsync();
    }
}
