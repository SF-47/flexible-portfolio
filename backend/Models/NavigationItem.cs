
namespace backend.Models;

public class NavigationItem
{
    public int Id { get; set; }

    public string Label { get; set; } = string.Empty;
    public string LinkType { get; set; } = "section";

    public Guid? SectionId { get; set; }
    public Section? Section { get; set; }

    public string? Url { get; set; }

    public int SortOrder { get; set; }
    public bool IsVisible { get; set; } = true;
    public bool OpenInNewTab { get; set; } = false;
}
