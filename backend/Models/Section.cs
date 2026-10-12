
namespace backend.Models;

public class Section
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Type { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Variant { get; set; } = "default";

    public int SortOrder { get; set; }
    public bool IsVisible { get; set; } = true;

    public string? NavLabel { get; set; }

    public string ContentJson { get; set; } = "{}";
    public string SettingsJson { get; set; } = "{}";

    public int SchemaVersion { get; set; } = 1;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<NavigationItem> NavigationItems { get; set; }
        = new List<NavigationItem>();
}
