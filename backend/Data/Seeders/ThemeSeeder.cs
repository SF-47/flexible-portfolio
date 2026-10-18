using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seeders;

public static class ThemeSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var presets = new List<Theme>
        {
            new Theme
            {
                Name = "Classic Gold",
                PrimaryColor = "#020617",
                AccentColor = "#FBBF24",
                BackgroundColor = "#FFFFFF",
                TextColor = "#0F172A",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#020617",
                HeadingFont = "Inter",
                BodyFont = "Inter",
                NavbarVariant = "default",
                IsActive = true,
            },
            new Theme
            {
                Name = "Forest Green",
                PrimaryColor = "#12372A",
                AccentColor = "#D4AF37",
                BackgroundColor = "#F8F7F2",
                TextColor = "#18332B",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#12372A",
                HeadingFont = "Inter",
                BodyFont = "Inter",
                NavbarVariant = "default",
                IsActive = false,
            },
            new Theme
            {
                Name = "Royal Navy",
                PrimaryColor = "#14253D",
                AccentColor = "#D69A62",
                BackgroundColor = "#F7F5F1",
                TextColor = "#1B293B",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#14253D",
                HeadingFont = "Inter",
                BodyFont = "Inter",
                NavbarVariant = "default",
                IsActive = false,
            },
            new Theme
            {
                Name = "Charcoal",
                PrimaryColor = "#1D252D",
                AccentColor = "#8CC8E8",
                BackgroundColor = "#F5F8FA",
                TextColor = "#24313B",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#1D252D",
                HeadingFont = "Inter",
                BodyFont = "Inter",
                NavbarVariant = "default",
                IsActive = false,
            },
            new Theme
            {
                Name = "Custom Theme",
                PrimaryColor = "#000000",
                AccentColor = "#000000",
                BackgroundColor = "#000000",
                TextColor = "#000000",
                OnPrimaryColor = "#000000",
                OnAccentColor = "#000000",
                HeadingFont = "Inter",
                BodyFont = "Inter",
                NavbarVariant = "default",
                IsCustom = true,
                IsActive = false,
            },
        };

        var existingNames = await context
            .Themes.AsNoTracking()
            .Select(theme => theme.Name)
            .ToListAsync();

        var existingNameSet = existingNames.ToHashSet(StringComparer.OrdinalIgnoreCase);

        var missingPresets = presets.Where(theme => !existingNameSet.Contains(theme.Name)).ToList();

        if (missingPresets.Count == 0)
            return;

        // Do not activate a new preset if an active theme already exists.
        var hasActiveTheme = await context.Themes.AnyAsync(theme => theme.IsActive);

        if (hasActiveTheme)
        {
            foreach (var theme in missingPresets)
            {
                theme.IsActive = false;
            }
        }

        await context.Themes.AddRangeAsync(missingPresets);
        await context.SaveChangesAsync();
    }
}
