namespace backend.DTOs.SiteSettings;

public record SiteSettingsResponse(
    int Id,
    string CompanyName,
    string? Tagline,
    string? Description,
    string? Email,
    string? Phone,
    string? Address,
    int? LogoMediaId,
    int? FaviconMediaId,
    string? FooterDescription,
    string? SeoTitle,
    string? SeoDescription
);
