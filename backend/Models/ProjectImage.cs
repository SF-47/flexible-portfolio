
namespace backend.Models;

public class ProjectImage
{
    public int Id { get; set; }

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public int MediaAssetId { get; set; }
    public MediaAsset MediaAsset { get; set; } = null!;

    public int SortOrder { get; set; }

    public string? Caption { get; set; }
}
