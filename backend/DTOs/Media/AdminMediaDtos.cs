namespace backend.DTOs.Media;

// A media asset as the admin sees it: the public fields plus where it is used
// (empty when the image is unused).
public record AdminMediaAssetResponse(
    int Id,
    string OriginalFileName,
    string Url,
    string ContentType,
    long FileSizeBytes,
    string? AltText,
    DateTime CreatedAt,
    List<string> UsedIn
);

// Only the alt text can be changed; the file and the record stay the same.
public record UpdateMediaRequest(string? AltText);
