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
                HeadingFont = "Roboto",
                BodyFont = "Roboto",
                NavbarVariant = "default",
                IsActive = false,
            },
            new Theme
            {
                Name = "Terracotta",
                PrimaryColor = "#6D3B2D",
                AccentColor = "#D98D63",
                BackgroundColor = "#FBF5EC",
                TextColor = "#3C2C27",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#26170F",
                HeadingFont = "Lato",
                BodyFont = "Lato",
                NavbarVariant = "centered",
                IsActive = false,
            },
            new Theme
            {
                Name = "Arctic Minimal",
                PrimaryColor = "#E8EDF2",
                AccentColor = "#2563EB",
                BackgroundColor = "#FFFFFF",
                TextColor = "#172033",
                OnPrimaryColor = "#172033",
                OnAccentColor = "#FFFFFF",
                HeadingFont = "Inter",
                BodyFont = "Inter",
                NavbarVariant = "centered",
                IsActive = false,
            },
            new Theme
            {
                Name = "Burgundy Luxe",
                PrimaryColor = "#4C1026",
                AccentColor = "#D8B16D",
                BackgroundColor = "#FFF9F5",
                TextColor = "#341B23",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#24140B",
                HeadingFont = "Lato",
                BodyFont = "Lato",
                NavbarVariant = "split",
                IsActive = false,
            },
            new Theme
            {
                Name = "Emerald Slate",
                PrimaryColor = "#142B32",
                AccentColor = "#36C6A0",
                BackgroundColor = "#F2F8F7",
                TextColor = "#17313B",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#082C23",
                HeadingFont = "Poppins",
                BodyFont = "Inter",
                NavbarVariant = "default",
                IsActive = false,
            },
            new Theme
            {
                Name = "Sunset Copper",
                PrimaryColor = "#38242A",
                AccentColor = "#E98957",
                BackgroundColor = "#FFF4EC",
                TextColor = "#3A2826",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#26150B",
                HeadingFont = "Roboto",
                BodyFont = "Lato",
                NavbarVariant = "centered",
                IsActive = false,
            },
            new Theme
            {
                Name = "Monochrome",
                PrimaryColor = "#171717",
                AccentColor = "#737373",
                BackgroundColor = "#FAFAFA",
                TextColor = "#171717",
                OnPrimaryColor = "#FFFFFF",
                OnAccentColor = "#FFFFFF",
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
