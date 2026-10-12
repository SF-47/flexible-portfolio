
namespace backend.Models;

public class MediaAsset
{
    public int Id { get; set; }

    public string OriginalFileName { get; set; } = string.Empty;
    public string StorageKey { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;

    public long FileSizeBytes { get; set; }

    public string? AltText { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ProjectImage> ProjectImages { get; set; }
        = new List<ProjectImage>();
}
