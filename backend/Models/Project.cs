
namespace backend.Models;

public class Project
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;

    public string? Description { get; set; }
    public string? FullDescription { get; set; }

    public string? Category { get; set; }
    public string? Location { get; set; }
    public DateOnly? CompletionDate { get; set; }

    public int? FeaturedImageId { get; set; }
    public MediaAsset? FeaturedImage { get; set; }

    public bool IsFeatured { get; set; } = false;
    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

}
