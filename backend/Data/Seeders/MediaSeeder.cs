using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seeders;

// Registers the template's demo images (SeedData/images) in the Media Library, so every
// new project made from this template starts with them. Safe to run again.
public static class MediaSeeder
{
    public const string StoragePrefix = "uploads/seed-";

    private static readonly Dictionary<string, string> AltTexts = new()
    {
        ["about.jpg"] = "Construction team at work on site",
        ["project-1.jpg"] = "Modern residence project",
        ["project-2.jpg"] = "Business center project",
        ["project-3.jpg"] = "Urban tower project",
        ["project-4.jpg"] = "Construction project",
        ["project-5.jpg"] = "Construction project",
    };

    public static async Task SeedAsync(AppDbContext context, string contentRoot, string webRoot)
    {
        var sourceDirectory = Path.Combine(contentRoot, "SeedData", "images");

        if (!Directory.Exists(sourceDirectory))
            return;

        var uploadDirectory = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadDirectory);

        var existingKeys = (
            await context.MediaAssets.Select(media => media.StorageKey).ToListAsync()
        ).ToHashSet(StringComparer.OrdinalIgnoreCase);

        foreach (var sourcePath in Directory.GetFiles(sourceDirectory, "*.jpg").Order())
        {
            var fileName = Path.GetFileName(sourcePath);
            var storageKey = StoragePrefix + fileName;

            if (existingKeys.Contains(storageKey))
                continue;

            var targetPath = Path.Combine(uploadDirectory, "seed-" + fileName);

            if (!File.Exists(targetPath))
                File.Copy(sourcePath, targetPath);

            context.MediaAssets.Add(
                new MediaAsset
                {
                    OriginalFileName = fileName,
                    StorageKey = storageKey,
                    ContentType = "image/jpeg",
                    FileSizeBytes = new FileInfo(targetPath).Length,
                    AltText = AltTexts.GetValueOrDefault(fileName),
                    CreatedAt = DateTime.UtcNow,
                }
            );
        }

        await context.SaveChangesAsync();
    }
}
