using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seeders;

public static class SocialLinkSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var predefinedLinks = new[]
        {
            new
            {
                Platform = "Facebook",
                Url = "https://facebook.example.com/atlas-construction",
                Order = 1,
            },
            new
            {
                Platform = "Instagram",
                Url = "https://instagram.example.com/atlas-construction",
                Order = 2,
            },
            new
            {
                Platform = "LinkedIn",
                Url = "https://linkedin.example.com/company/atlas-construction",
                Order = 3,
            },
        };

        var existingPlatforms = (
            await context.SocialLinks.AsNoTracking().Select(link => link.Platform).ToListAsync()
        ).ToHashSet(StringComparer.Ordinal);

        var newLinks = predefinedLinks
            .Where(item => !existingPlatforms.Contains(item.Platform))
            .Select(item => new SocialLink
            {
                Platform = item.Platform,
                Url = item.Url,
                SortOrder = item.Order,
                IsVisible = true,
            })
            .ToList();

        if (newLinks.Count == 0)
            return;

        await context.SocialLinks.AddRangeAsync(newLinks);
        await context.SaveChangesAsync();
    }
}
