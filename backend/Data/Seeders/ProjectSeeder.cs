using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seeders;

public static class ProjectSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var projects = new List<Project>
        {
            new Project
            {
                Title = "Modern Residence",
                Slug = "modern-residence",
                Description =
                    "A contemporary private residence combining open living spaces, natural light, and durable materials.",
                FullDescription =
                    "A contemporary private residence designed around open living spaces, generous natural light, and long-lasting materials, delivered from planning through final handover.",
                Category = "Residential",
                Location = "Beirut, Lebanon",
                CompletionDate = new DateOnly(2023, 6, 15),
                IsFeatured = true,
                SortOrder = 1,
            },
            new Project
            {
                Title = "Business Center",
                Slug = "business-center",
                Description =
                    "A modern commercial complex with flexible office floors and efficient building systems.",
                FullDescription =
                    "A modern commercial complex featuring flexible office floors, efficient building systems, and functional shared spaces built for long-term value.",
                Category = "Commercial",
                Location = "Dubai, UAE",
                CompletionDate = new DateOnly(2024, 3, 20),
                IsFeatured = true,
                SortOrder = 2,
            },
            new Project
            {
                Title = "Urban Tower",
                Slug = "urban-tower",
                Description =
                    "A landmark high-rise tower with a distinctive architectural identity in the city skyline.",
                FullDescription =
                    "A landmark high-rise tower with a distinctive architectural identity, combining advanced engineering with refined design for the city skyline.",
                Category = "Architecture",
                Location = "Doha, Qatar",
                CompletionDate = new DateOnly(2024, 11, 10),
                IsFeatured = true,
                SortOrder = 3,
            },
        };

        var existingSlugs = await context.Projects.Select(project => project.Slug).ToListAsync();

        var newProjects = projects.Where(project => !existingSlugs.Contains(project.Slug)).ToList();

        if (newProjects.Count == 0)
            return;

        await context.Projects.AddRangeAsync(newProjects);
        await context.SaveChangesAsync();
    }
}
