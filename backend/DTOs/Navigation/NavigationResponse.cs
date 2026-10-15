namespace backend.DTOs.Navigation;

public record NavigationResponse(
    int Id,
    string Label,
    string LinkType,
    Guid? SectionId,
    string? SectionType,
    string? Url,
    int SortOrder,
    bool OpenInNewTab
);
