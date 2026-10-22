namespace backend.DTOs.Sections;

public record SectionResponse(
    Guid Id,
    string Type,
    string Name,
    string Variant,
    int Order,
    bool IsVisible,
    string? NavLabel,
    string ContentJson,
    string SettingsJson,
    DateTime UpdatedAt
);
