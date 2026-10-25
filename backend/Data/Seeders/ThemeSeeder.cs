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
                HeadingFont = "Playfair Display",
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
                Name = "Midnight Purple",
                PrimaryColor = "#231942",
                AccentColor = "#C4A1FF",
                BackgroundColor = "#F8F5FF",
                TextColor = "#221936",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#221936",
                HeadingFont = "Poppins",
                BodyFont = "Inter",
                NavbarVariant = "split",
                IsActive = false,
            },
            new Theme
            {
                Name = "Ocean Blue",
                PrimaryColor = "#0B3954",
                AccentColor = "#00A6A6",
                BackgroundColor = "#F0F8FA",
                TextColor = "#183446",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#FFFFFF",
                HeadingFont = "Oswald",
                BodyFont = "Inter",
                NavbarVariant = "default",
                IsActive = false,
            },
            new Theme
            {
                Name = "Midnight Gold",
                PrimaryColor = "#0B0F19",
                AccentColor = "#FBBF24",
                BackgroundColor = "#0F172A",
                TextColor = "#F1F5F9",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#0B0F19",
                HeadingFont = "Inter",
                BodyFont = "Inter",
                NavbarVariant = "default",
                IsActive = false,
            },
            new Theme
            {
                Name = "Graphite Blue",
                PrimaryColor = "#111827",
                AccentColor = "#60A5FA",
                BackgroundColor = "#0B1220",
                TextColor = "#E5E7EB",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#0B1220",
                HeadingFont = "Space Mono",
                BodyFont = "Inter",
                NavbarVariant = "centered",
                IsActive = false,
            },
            new Theme
            {
                Name = "Dark Burgundy",
                PrimaryColor = "#2A0A18",
                AccentColor = "#E0B76F",
                BackgroundColor = "#1A0B12",
                TextColor = "#F6E9ED",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#24140B",
                HeadingFont = "Playfair Display",
                BodyFont = "Inter",
                NavbarVariant = "split",
                IsActive = false,
            },
            new Theme
            {
                Name = "Dark Emerald",
                PrimaryColor = "#06231D",
                AccentColor = "#34D399",
                BackgroundColor = "#0A1F1A",
                TextColor = "#E6F4EF",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#06231D",
                HeadingFont = "Poppins",
                BodyFont = "Inter",
                NavbarVariant = "default",
                IsActive = false,
            },
            new Theme
            {
                Name = "Dark Copper",
                PrimaryColor = "#1F1412",
                AccentColor = "#E98957",
                BackgroundColor = "#17100E",
                TextColor = "#F5E9E2",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#26150B",
                HeadingFont = "Oswald",
                BodyFont = "Merriweather",
                NavbarVariant = "centered",
                IsActive = false,
            },
            new Theme
            {
                Name = "Noir",
                PrimaryColor = "#0A0A0A",
                AccentColor = "#A3A3A3",
                BackgroundColor = "#121212",
                TextColor = "#F5F5F5",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#0A0A0A",
                HeadingFont = "Inter",
                BodyFont = "Inter",
                NavbarVariant = "split",
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

        // Presets that were replaced by newer ones. They are removed unless one is active.
        var retiredNames = new[]
        {
            "Terracotta",
            "Arctic Minimal",
            "Burgundy Luxe",
            "Emerald Slate",
            "Sunset Copper",
            "Monochrome",
        };

        var retired = await context
            .Themes.Where(theme =>
                !theme.IsCustom && !theme.IsActive && retiredNames.Contains(theme.Name)
            )
            .ToListAsync();

        if (retired.Count > 0)
        {
            context.Themes.RemoveRange(retired);
            await context.SaveChangesAsync();
        }

        // Fonts that were removed from the supported list (Roboto, Lato). Existing themes that
        // still use one get the font their preset now defines, or Inter for the Custom Theme.
        var removedFonts = new[] { "Roboto", "Lato" };

        var outdated = await context
            .Themes.Where(theme =>
                removedFonts.Contains(theme.HeadingFont) || removedFonts.Contains(theme.BodyFont)
            )
            .ToListAsync();

        foreach (var theme in outdated)
        {
            var preset = presets.FirstOrDefault(item =>
                !theme.IsCustom && item.Name.Equals(theme.Name, StringComparison.OrdinalIgnoreCase)
            );

            if (removedFonts.Contains(theme.HeadingFont))
                theme.HeadingFont = preset?.HeadingFont ?? "Inter";

            if (removedFonts.Contains(theme.BodyFont))
                theme.BodyFont = preset?.BodyFont ?? "Inter";
        }

        if (outdated.Count > 0)
            await context.SaveChangesAsync();

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
