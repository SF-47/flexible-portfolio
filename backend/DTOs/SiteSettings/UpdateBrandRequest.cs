namespace backend.DTOs.SiteSettings;

// Only these properties can be changed here; every other SiteSettings value is untouched.
public record UpdateBrandRequest(string CompanyName, int? LogoMediaId, string? FooterDescription);
