using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seeders;

public static class NavigationSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var predefinedItems = new[]
        {
            new
            {
                Label = "Home",
                SectionType = "hero",
                Order = 1,
            },
            new
            {
                Label = "About",
                SectionType = "about",
                Order = 2,
            },
            new
            {
                Label = "Services",
                SectionType = "services",
                Order = 3,
            },
            new
            {
                Label = "Projects",
                SectionType = "projects",
                Order = 4,
            },
            new
            {
                Label = "Contact",
                SectionType = "contact",
                Order = 5,
            },
        };

        var sectionIdsByType = await context
            .Sections.AsNoTracking()
            .ToDictionaryAsync(section => section.Type, section => section.Id);

        var existingLabels = (
            await context.NavigationItems.AsNoTracking().Select(item => item.Label).ToListAsync()
        ).ToHashSet(StringComparer.Ordinal);

        var newItems = new List<NavigationItem>();

        foreach (var item in predefinedItems)
        {
            if (existingLabels.Contains(item.Label))
                continue;

            if (!sectionIdsByType.TryGetValue(item.SectionType, out var sectionId))
            {
                throw new InvalidOperationException(
                    $"Section '{item.SectionType}' was not found. Run --seed-sections first."
                );
            }

            newItems.Add(
                new NavigationItem
                {
                    Label = item.Label,
                    LinkType = "section",
                    SectionId = sectionId,
                    SortOrder = item.Order,
                    IsVisible = true,
                    OpenInNewTab = false,
                }
            );
        }

        if (newItems.Count == 0)
            return;

        await context.NavigationItems.AddRangeAsync(newItems);
        await context.SaveChangesAsync();
    }
}
