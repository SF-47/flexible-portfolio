using backend.DTOs.Media;

namespace backend.Services.Media;

public interface IMediaService
{
    Task<List<MediaAssetResponse>> GetAllAsync();

    Task<MediaAssetResponse?> GetByIdAsync(int id);

    // 400 when the file or the alt text is not acceptable.
    Task<ServiceResult<MediaAssetResponse>> UploadAsync(IFormFile file, string? altText);

    // Every image with the places that use it, computed in a few queries (not per image).
    Task<List<AdminMediaAssetResponse>> GetAllWithUsageAsync();

    // 404 when the image does not exist, 400 for a bad alt text.
    Task<ServiceResult<AdminMediaAssetResponse>> UpdateAltTextAsync(int id, string? altText);

    // 404 when the image does not exist. 409 when it is still used: Data then holds the
    // places that use it. On success Data is an empty list.
    Task<ServiceResult<List<string>>> DeleteAsync(int id);
}
