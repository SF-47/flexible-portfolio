using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seeders;

public static class SiteSettingsSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var settingsExist = await context.SiteSettings.AnyAsync();

        if (settingsExist)
            return;

        var settings = new SiteSettings
        {
            CompanyName = "ATLAS Construction",
            Tagline = "CONSTRUCTION & ENGINEERING",
            Description =
                "We deliver modern construction solutions with quality, precision, and trust.",
            Email = "info@atlas.example",
            Phone = "+961 01 123456",
            Address = "Beirut, Lebanon",
            FooterDescription =
                "Building the future through innovation, craftsmanship, and excellence.",
            SeoTitle = "ATLAS Construction | Building the Future",
            SeoDescription = "Professional construction, engineering, and architectural solutions.",
            UpdatedAt = DateTime.UtcNow,
        };

        context.SiteSettings.Add(settings);

        await context.SaveChangesAsync();
    }
}
