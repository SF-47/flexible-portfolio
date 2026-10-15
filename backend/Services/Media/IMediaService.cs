using backend.DTOs.Media;

namespace backend.Services.Media;

public interface IMediaService
{
    Task<List<MediaAssetResponse>> GetAllAsync();

    Task<MediaAssetResponse?> GetByIdAsync(int id);
    Task<MediaAssetResponse> UploadAsync(IFormFile file, string? altText);
}
