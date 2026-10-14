using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seeders;

public static class SectionSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        var predefinedSections = new[]
        {
            new
            {
                Type = "hero",
                Name = "Hero",
                Order = 1,
            },
            new
            {
                Type = "about",
                Name = "About Us",
                Order = 2,
            },
            new
            {
                Type = "stats",
                Name = "Statistics",
                Order = 3,
            },
            new
            {
                Type = "services",
                Name = "Services",
                Order = 4,
            },
            new
            {
                Type = "whyChooseUs",
                Name = "Why Choose Us",
                Order = 5,
            },
            new
            {
                Type = "projects",
                Name = "Projects",
                Order = 6,
            },
            new
            {
                Type = "process",
                Name = "Our Process",
                Order = 7,
            },
            new
            {
                Type = "gallery",
                Name = "Gallery",
                Order = 8,
            },
            new
            {
                Type = "team",
                Name = "Our Team",
                Order = 9,
            },
            new
            {
                Type = "clients",
                Name = "Clients & Partners",
                Order = 10,
            },
            new
            {
                Type = "testimonials",
                Name = "Testimonials",
                Order = 11,
            },
            new
            {
                Type = "certifications",
                Name = "Certifications & Awards",
                Order = 12,
            },
            new
            {
                Type = "faq",
                Name = "FAQ",
                Order = 13,
            },
            new
            {
                Type = "cta",
                Name = "Call to Action",
                Order = 14,
            },
            new
            {
                Type = "contact",
                Name = "Contact Us",
                Order = 15,
            },
        };

        var existingTypes = await db
            .Sections.AsNoTracking()
            .Select(section => section.Type)
            .ToListAsync();

        var existingTypeSet = existingTypes.ToHashSet(StringComparer.Ordinal);

        var newSections = predefinedSections
            .Where(item => !existingTypeSet.Contains(item.Type))
            .Select(item => new Section
            {
                Type = item.Type,
                Name = item.Name,
                Variant = "default",
                SortOrder = item.Order,
                IsVisible = true,
                ContentJson = "{}",
                SettingsJson = "{}",
                SchemaVersion = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            })
            .ToList();

        if (newSections.Count == 0)
            return;

        await db.Sections.AddRangeAsync(newSections);
        await db.SaveChangesAsync();
    }
}
