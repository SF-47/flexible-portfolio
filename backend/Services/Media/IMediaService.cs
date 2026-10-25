using backend.DTOs.Media;

namespace backend.Services.Media;

public interface IMediaService
{
    Task<List<MediaAssetResponse>> GetAllAsync();

    Task<MediaAssetResponse?> GetByIdAsync(int id);
    Task<MediaAssetResponse> UploadAsync(IFormFile file, string? altText);

    // Every image with the places that use it, computed in a few queries (not per image).
    Task<List<AdminMediaAssetResponse>> GetAllWithUsageAsync();

    // Returns null when the image does not exist. Throws ArgumentException for a bad alt text.
    Task<AdminMediaAssetResponse?> UpdateAltTextAsync(int id, string? altText);

    Task<DeleteMediaResult> DeleteAsync(int id);
}

public enum DeleteMediaStatus
{
    Deleted,
    NotFound,
    InUse,
}

public record DeleteMediaResult(DeleteMediaStatus Status, List<string> UsedIn);
