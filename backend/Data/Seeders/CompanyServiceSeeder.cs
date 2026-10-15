using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seeders;

public static class CompanyServiceSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        var servicesExist = await context.Services.AnyAsync();

        if (servicesExist)
            return;

        var services = new List<Service>
        {
            new Service
            {
                Title = "Residential Construction",
                Description =
                    "Complete residential construction solutions, from planning to final delivery.",
                IconName = "House",
                SortOrder = 1,
                IsActive = true,
            },
            new Service
            {
                Title = "Commercial Construction",
                Description =
                    "Modern commercial spaces designed for functionality and long-term value.",
                IconName = "Building2",
                SortOrder = 2,
                IsActive = true,
            },
            new Service
            {
                Title = "Architectural Design",
                Description =
                    "Creative and practical architectural solutions tailored to each project.",
                IconName = "DraftingCompass",
                SortOrder = 3,
                IsActive = true,
            },
            new Service
            {
                Title = "Renovation & Remodeling",
                Description =
                    "Transforming existing properties with modern designs and quality craftsmanship.",
                IconName = "Hammer",
                SortOrder = 4,
                IsActive = true,
            },
            new Service
            {
                Title = "Project Management",
                Description =
                    "Coordinating schedules, resources, and quality throughout project execution.",
                IconName = "ClipboardCheck",
                SortOrder = 5,
                IsActive = true,
            },
            new Service
            {
                Title = "Engineering Solutions",
                Description =
                    "Professional engineering support for safe and efficient construction.",
                IconName = "HardHat",
                SortOrder = 6,
                IsActive = true,
            },
        };

        await context.Services.AddRangeAsync(services);
        await context.SaveChangesAsync();
    }
}
