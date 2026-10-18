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

    private static readonly HashSet<string> SupportedFonts = new(StringComparer.OrdinalIgnoreCase)
    {
        "Inter",
        "Poppins",
        "Roboto",
        "Lato",
    };

    private static readonly HashSet<string> SupportedNavbarVariants = new(
        StringComparer.OrdinalIgnoreCase
    )
    {
        "default",
        "centered",
        "split",
    };

    private static ThemeResponse ToResponse(Theme theme)
    {
        return new ThemeResponse(
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
    }

    public async Task<ThemeResponse?> UpdateAsync(int id, UpdateThemeRequest request)
    {
        var theme = await _context.Themes.FindAsync(id);

        if (theme is null)
            return null;

        if (
            !SupportedFonts.Contains(request.HeadingFont)
            || !SupportedFonts.Contains(request.BodyFont)
        )
        {
            throw new ArgumentException("Unsupported font selected.");
        }

        if (!SupportedNavbarVariants.Contains(request.NavbarVariant))
        {
            throw new ArgumentException("Unsupported navbar variant.");
        }

        theme.PrimaryColor = request.PrimaryColor;
        theme.AccentColor = request.AccentColor;
        theme.BackgroundColor = request.BackgroundColor;
        theme.TextColor = request.TextColor;
        theme.OnPrimaryColor = request.OnPrimaryColor;
        theme.OnAccentColor = request.OnAccentColor;

        theme.HeadingFont = request.HeadingFont;
        theme.BodyFont = request.BodyFont;
        theme.NavbarVariant = request.NavbarVariant.ToLowerInvariant();

        await _context.SaveChangesAsync();

        return ToResponse(theme);
    }

    public async Task<ThemeResponse?> ActivateAsync(int id)
    {
        var themes = await _context.Themes.ToListAsync();

        var selectedTheme = themes.FirstOrDefault(t => t.Id == id);

        if (selectedTheme is null)
            return null;

        foreach (var theme in themes)
        {
            theme.IsActive = theme.Id == id;
        }

        await _context.SaveChangesAsync();

        return ToResponse(selectedTheme);
    }
}
