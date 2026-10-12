
namespace backend.Models;

public class SiteSettings
{
    public int Id { get; set; }

    public string CompanyName { get; set; } = string.Empty;
    public string? Tagline { get; set; }
    public string? Description { get; set; }

    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }

    public int? LogoMediaId { get; set; }
    public MediaAsset? LogoMedia { get; set; }

    public int? FaviconMediaId { get; set; }
    public MediaAsset? FaviconMedia { get; set; }

    public string? FooterDescription { get; set; }

    public string? SeoTitle { get; set; }
    public string? SeoDescription { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
