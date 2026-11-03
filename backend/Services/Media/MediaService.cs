using System.Linq.Expressions;
using System.Text.Json;
using backend.Data;
using backend.DTOs.Media;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Media;

public class MediaService : IMediaService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<MediaService> _logger;

    private const int MaxAltTextLength = 200;

    public MediaService(
        AppDbContext context,
        IWebHostEnvironment environment,
        ILogger<MediaService> logger
    )
    {
        _context = context;
        _environment = environment;
        _logger = logger;
    }

    private static readonly Expression<Func<MediaAsset, MediaAssetResponse>> MediaProjection =
        media => new MediaAssetResponse(
            media.Id,
            media.OriginalFileName,
            "/" + media.StorageKey,
            media.ContentType,
            media.FileSizeBytes,
            media.AltText,
            media.CreatedAt
        );

    public async Task<List<MediaAssetResponse>> GetAllAsync()
    {
        return await _context
            .MediaAssets.AsNoTracking()
            .OrderByDescending(media => media.CreatedAt)
            .Select(MediaProjection)
            .ToListAsync();
    }

    public async Task<MediaAssetResponse?> GetByIdAsync(int id)
    {
        return await _context
            .MediaAssets.AsNoTracking()
            .Where(media => media.Id == id)
            .Select(MediaProjection)
            .FirstOrDefaultAsync();
    }

    public async Task<ServiceResult<MediaAssetResponse>> UploadAsync(
        IFormFile file,
        string? altText
    )
    {
        const long maxFileSize = 5 * 1024 * 1024;

        if (file is null || file.Length == 0)
        {
            return ServiceResult<MediaAssetResponse>.BadRequest("Please select an image.");
        }

        if (file.Length > maxFileSize)
        {
            return ServiceResult<MediaAssetResponse>.BadRequest("Image must not exceed 5 MB.");
        }

        var altTextError = ValidateAltText(altText);

        if (altTextError is not null)
        {
            return ServiceResult<MediaAssetResponse>.BadRequest(altTextError);
        }

        altText = TrimOrNull(altText);

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

        if (!allowedExtensions.Contains(extension))
        {
            return ServiceResult<MediaAssetResponse>.BadRequest(
                "Only JPG, PNG, and WebP images are allowed."
            );
        }

        byte[] header = new byte[12];

        using (var stream = file.OpenReadStream())
        {
            var totalRead = 0;

            while (totalRead < header.Length)
            {
                var bytesRead = await stream.ReadAsync(
                    header.AsMemory(totalRead, header.Length - totalRead)
                );

                if (bytesRead == 0)
                {
                    break;
                }

                totalRead += bytesRead;
            }

            if (totalRead < 12)
            {
                return ServiceResult<MediaAssetResponse>.BadRequest("Invalid image file.");
            }
        }

        bool isJpeg = header[0] == 0xFF && header[1] == 0xD8 && header[2] == 0xFF;

        bool isPng = header
            .AsSpan(0, 8)
            .SequenceEqual(new byte[] { 137, 80, 78, 71, 13, 10, 26, 10 });

        bool isWebp =
            header.AsSpan(0, 4).SequenceEqual("RIFF"u8)
            && header.AsSpan(8, 4).SequenceEqual("WEBP"u8);

        string contentType;

        if (isJpeg && (extension == ".jpg" || extension == ".jpeg"))
        {
            contentType = "image/jpeg";
        }
        else if (isPng && extension == ".png")
        {
            contentType = "image/png";
        }
        else if (isWebp && extension == ".webp")
        {
            contentType = "image/webp";
        }
        else
            return ServiceResult<MediaAssetResponse>.BadRequest(
                "File contents do not match a supported image format."
            );

        var filename = $"{Guid.NewGuid():N}{extension}";

        var webRoot = _environment.WebRootPath;

        if (string.IsNullOrWhiteSpace(webRoot))
        {
            throw new InvalidOperationException("Web root is not configured.");
        }

        var uploadDirectory = Path.Combine(webRoot, "uploads");

        Directory.CreateDirectory(uploadDirectory);

        var filePath = Path.Combine(uploadDirectory, filename);

        try
        {
            await using (
                var fileStream = new FileStream(filePath, FileMode.CreateNew, FileAccess.Write)
            )
            {
                await file.CopyToAsync(fileStream);
            }

            var media = new MediaAsset
            {
                OriginalFileName = Path.GetFileName(file.FileName),
                StorageKey = $"uploads/{filename}",
                ContentType = contentType,
                FileSizeBytes = file.Length,
                AltText = altText,
                CreatedAt = DateTime.UtcNow,
            };

            _context.MediaAssets.Add(media);

            await _context.SaveChangesAsync();

            var response = new MediaAssetResponse(
                media.Id,
                media.OriginalFileName,
                "/" + media.StorageKey,
                media.ContentType,
                media.FileSizeBytes,
                media.AltText,
                media.CreatedAt
            );

            return ServiceResult<MediaAssetResponse>.Ok(response);
        }
        catch
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }

            throw;
        }
    }

    // Returns an error message when the alt text is not acceptable, otherwise null.
    private static string? ValidateAltText(string? altText)
    {
        var text = altText?.Trim();

        if (string.IsNullOrEmpty(text))
        {
            return null;
        }

        if (text.Length > MaxAltTextLength)
        {
            return $"Alt text must not exceed {MaxAltTextLength} characters.";
        }

        if (text.Any(char.IsControl))
        {
            return "Alt text cannot contain control characters.";
        }

        return null;
    }

    // Trims the text; an empty text is stored as null.
    private static string? TrimOrNull(string? altText)
    {
        var text = altText?.Trim();

        if (string.IsNullOrEmpty(text))
        {
            return null;
        }

        return text;
    }

    // The media references live in Sections.ContentJson / SettingsJson (the property
    // "imageMediaId", which the section content validator accepts on hero, about, gallery
    // items and team members), SiteSettings (logo, favicon), Services and Projects. Other
    // JSON properties that merely end in "Id" are not media references.
    private const string MediaProperty = "imageMediaId";

    private static void CollectMediaIds(JsonElement element, Action<int> found)
    {
        switch (element.ValueKind)
        {
            case JsonValueKind.Object:
                foreach (var property in element.EnumerateObject())
                {
                    if (
                        property.Name == MediaProperty
                        && property.Value.ValueKind == JsonValueKind.Number
                        && property.Value.TryGetInt32(out var id)
                    )
                    {
                        found(id);
                    }
                    else
                    {
                        CollectMediaIds(property.Value, found);
                    }
                }
                break;
            case JsonValueKind.Array:
                foreach (var item in element.EnumerateArray())
                    CollectMediaIds(item, found);
                break;
        }
    }

    // One pass over the places that can reference an image: media id -> where it is used.
    private async Task<Dictionary<int, List<string>>> FindUsageAsync()
    {
        var usage = new Dictionary<int, List<string>>();

        void Add(int? id, string label)
        {
            if (id is null)
            {
                return;
            }

            if (!usage.TryGetValue(id.Value, out var places))
            {
                usage[id.Value] = places = new List<string>();
            }

            if (!places.Contains(label))
            {
                places.Add(label);
            }
        }

        var sections = await _context
            .Sections.AsNoTracking()
            .OrderBy(section => section.SortOrder)
            .Select(section => new
            {
                section.Name,
                section.ContentJson,
                section.SettingsJson,
            })
            .ToListAsync();

        foreach (var section in sections)
        {
            foreach (var json in new[] { section.ContentJson, section.SettingsJson })
            {
                try
                {
                    using var document = JsonDocument.Parse(json);
                    CollectMediaIds(document.RootElement, id => Add(id, section.Name));
                }
                catch (JsonException)
                {
                    // Not valid JSON, so it cannot hold a reference we could read.
                }
            }
        }

        var settings = await _context
            .SiteSettings.AsNoTracking()
            .Select(site => new { site.LogoMediaId, site.FaviconMediaId })
            .ToListAsync();

        foreach (var site in settings)
        {
            Add(site.LogoMediaId, "Navbar Logo");
            Add(site.FaviconMediaId, "Favicon");
        }

        var services = await _context
            .Services.AsNoTracking()
            .Where(service => service.ImageMediaId != null)
            .Select(service => new { service.Title, service.ImageMediaId })
            .ToListAsync();

        foreach (var service in services)
            Add(service.ImageMediaId, $"Service “{service.Title}”");

        var projects = await _context
            .Projects.AsNoTracking()
            .Where(project => project.FeaturedImageId != null)
            .Select(project => new { project.Title, project.FeaturedImageId })
            .ToListAsync();

        foreach (var project in projects)
            Add(project.FeaturedImageId, $"Project “{project.Title}”");

        return usage;
    }

    private static AdminMediaAssetResponse ToAdminResponse(
        MediaAsset media,
        Dictionary<int, List<string>> usage
    ) =>
        new(
            media.Id,
            media.OriginalFileName,
            "/" + media.StorageKey,
            media.ContentType,
            media.FileSizeBytes,
            media.AltText,
            media.CreatedAt,
            usage.TryGetValue(media.Id, out var places) ? places : new List<string>()
        );

    public async Task<List<AdminMediaAssetResponse>> GetAllWithUsageAsync()
    {
        var media = await _context
            .MediaAssets.AsNoTracking()
            .OrderByDescending(item => item.CreatedAt)
            .ToListAsync();
        var usage = await FindUsageAsync();

        return media.Select(item => ToAdminResponse(item, usage)).ToList();
    }

    public async Task<ServiceResult<AdminMediaAssetResponse>> UpdateAltTextAsync(
        int id,
        string? altText
    )
    {
        var altTextError = ValidateAltText(altText);

        if (altTextError is not null)
        {
            return ServiceResult<AdminMediaAssetResponse>.BadRequest(altTextError);
        }

        var text = TrimOrNull(altText);

        // Only the alt text changes: no new record, and the file is not touched.
        var updated = await _context
            .MediaAssets.Where(item => item.Id == id)
            .ExecuteUpdateAsync(setters => setters.SetProperty(item => item.AltText, text));

        if (updated == 0)
        {
            return ServiceResult<AdminMediaAssetResponse>.NotFound("Media asset not found.");
        }

        var media = await _context.MediaAssets.AsNoTracking().FirstAsync(item => item.Id == id);
        var usage = await FindUsageAsync();

        return ServiceResult<AdminMediaAssetResponse>.Ok(ToAdminResponse(media, usage));
    }

    // The stored key must stay inside wwwroot/uploads; anything else is never touched.
    private string ResolveUploadPath(string storageKey)
    {
        var webRoot = _environment.WebRootPath;

        if (string.IsNullOrWhiteSpace(webRoot))
        {
            throw new InvalidOperationException("Web root is not configured.");
        }

        var uploads =
            Path.GetFullPath(Path.Combine(webRoot, "uploads")) + Path.DirectorySeparatorChar;
        var path = Path.GetFullPath(Path.Combine(webRoot, storageKey));

        if (!path.StartsWith(uploads, StringComparison.Ordinal))
            throw new InvalidOperationException(
                "The stored file path is outside the upload folder."
            );

        return path;
    }

    // Deletes an unused image. In one transaction: the sections are locked, usage is
    // checked, the file is moved aside, the record is removed and the transaction is
    // committed; only then is the parked file deleted. If the database step fails the file
    // is moved back, so a record never points at a missing file. The database foreign keys
    // (logo, favicon, services, projects) are a second guard; section JSON has no foreign
    // key, which is why usage is checked here.
    public async Task<ServiceResult<List<string>>> DeleteAsync(int id)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        // Content saves update these rows, so they wait until this transaction ends.
        await _context.Database.ExecuteSqlRawAsync("SELECT `Id` FROM `Sections` FOR UPDATE");

        var media = await _context.MediaAssets.FirstOrDefaultAsync(item => item.Id == id);

        if (media is null)
        {
            return ServiceResult<List<string>>.NotFound("Media asset not found.");
        }

        var usage = await FindUsageAsync();

        if (usage.TryGetValue(id, out var places) && places.Count > 0)
        {
            return ServiceResult<List<string>>.Conflict(InUseMessage(places), places);
        }

        var path = ResolveUploadPath(media.StorageKey);
        var parked = path + ".deleting";
        var movedAside = false;

        if (File.Exists(path))
        {
            File.Move(path, parked, overwrite: true);
            movedAside = true;
        }

        try
        {
            _context.MediaAssets.Remove(media);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (DbUpdateException exception)
        {
            RestoreFile(movedAside, parked, path);
            _logger.LogWarning(exception, "Media {MediaId} could not be deleted.", id);

            var otherPlaces = new List<string> { "another part of the website" };

            return ServiceResult<List<string>>.Conflict(InUseMessage(otherPlaces), otherPlaces);
        }
        catch
        {
            RestoreFile(movedAside, parked, path);
            throw;
        }

        if (movedAside)
        {
            try
            {
                File.Delete(parked);
            }
            catch (Exception exception)
            {
                // The record is gone; a leftover parked file is harmless and can be removed later.
                _logger.LogWarning(exception, "Could not remove the parked file {File}.", parked);
            }
        }

        return ServiceResult<List<string>>.Ok(new List<string>());
    }

    // "Cannot delete this image because it is used in A, B and C."
    private static string InUseMessage(List<string> places)
    {
        string joined;

        if (places.Count <= 1)
        {
            joined = string.Join("", places);
        }
        else
        {
            joined = string.Join(", ", places.Take(places.Count - 1)) + " and " + places[^1];
        }

        return "Cannot delete this image because it is used in " + joined + ".";
    }

    private void RestoreFile(bool movedAside, string parked, string path)
    {
        if (!movedAside || !File.Exists(parked))
        {
            return;
        }

        try
        {
            File.Move(parked, path, overwrite: true);
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Could not restore {File}.", path);
        }
    }
}
