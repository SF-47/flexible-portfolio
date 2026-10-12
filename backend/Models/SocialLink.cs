
namespace backend.Models;

public class SocialLink
{
    public int Id { get; set; }

    public string Platform { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;

    public int SortOrder { get; set; }
    public bool IsVisible { get; set; } = true;
}
