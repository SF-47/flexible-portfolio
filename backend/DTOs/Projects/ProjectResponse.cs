namespace backend.DTOs.Projects;

public record ProjectResponse(
    int Id,
    string Title,
    string Slug,
    string? Description,
    string? Category,
    string? Location,
    DateOnly? CompletionDate,
    int? FeaturedImageId,
    bool IsFeatured,
    int SortOrder
);
