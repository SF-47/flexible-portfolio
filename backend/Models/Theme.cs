
namespace backend.Models;

public class Theme
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string PrimaryColor { get; set; } = "#020617";
    public string AccentColor { get; set; } = "#fbbf24";
    public string BackgroundColor { get; set; } = "#ffffff";
    public string TextColor { get; set; } = "#0f172a";
    public string OnPrimaryColor { get; set; } = "#ffffff";
    public string OnAccentColor { get; set; } = "#020617";

    public string HeadingFont { get; set; } = "Inter";
    public string BodyFont { get; set; } = "Inter";

    public string NavbarVariant { get; set; } = "default";

    public bool IsActive { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
