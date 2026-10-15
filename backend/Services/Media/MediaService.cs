using System.Linq.Expressions;
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

    public MediaService(AppDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
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

    public async Task<MediaAssetResponse> UploadAsync(IFormFile file, string? altText)
    {
        const long maxFileSize = 5 * 1024 * 1024;

        if (file is null || file.Length == 0)
            throw new ArgumentException("Please select an image.");

        if (file.Length > maxFileSize)
            throw new ArgumentException("Image must not exceed 5 MB.");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

        if (!allowedExtensions.Contains(extension))
            throw new ArgumentException("Only JPG, PNG, and WebP images are allowed.");

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
                    break;

                totalRead += bytesRead;
            }

            if (totalRead < 12)
                throw new ArgumentException("Invalid image file.");
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
            contentType = "image/jpeg";
        else if (isPng && extension == ".png")
            contentType = "image/png";
        else if (isWebp && extension == ".webp")
            contentType = "image/webp";
        else
            throw new ArgumentException("File contents do not match a supported image format.");

        var filename = $"{Guid.NewGuid():N}{extension}";

        var webRoot = _environment.WebRootPath;

        if (string.IsNullOrWhiteSpace(webRoot))
            throw new InvalidOperationException("Web root is not configured.");

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

            return new MediaAssetResponse(
                media.Id,
                media.OriginalFileName,
                "/" + media.StorageKey,
                media.ContentType,
                media.FileSizeBytes,
                media.AltText,
                media.CreatedAt
            );
        }
        catch
        {
            if (File.Exists(filePath))
                File.Delete(filePath);

            throw;
        }
    }
}
