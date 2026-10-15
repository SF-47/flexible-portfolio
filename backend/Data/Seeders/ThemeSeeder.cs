using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seeders;

public static class ThemeSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var themesExist = await context.Themes.AnyAsync();

        if (themesExist)
            return;

        var themes = new List<Theme>
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
                CreatedAt = DateTime.UtcNow,
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
                CreatedAt = DateTime.UtcNow,
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
                CreatedAt = DateTime.UtcNow,
            },
        };

        await context.Themes.AddRangeAsync(themes);
        await context.SaveChangesAsync();
    }
}
