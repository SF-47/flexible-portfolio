namespace backend.DTOs.Media;

public record MediaAssetResponse(
    int Id,
    string OriginalFileName,
    string Url,
    string ContentType,
    long FileSizeBytes,
    string? AltText,
    DateTime CreatedAt
);
