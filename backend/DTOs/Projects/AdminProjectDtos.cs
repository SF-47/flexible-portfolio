namespace backend.DTOs.Projects;

public record AdminProjectResponse(
    int Id,
    string Title,
    string Slug,
    string? Description,
    string? FullDescription,
    string? Category,
    string? Location,
    DateOnly? CompletionDate,
    int? FeaturedImageId,
    bool IsFeatured,
    int SortOrder,
    DateTime UpdatedAt
);

// Id is null for a new project. UpdatedAt is the value the admin loaded (stale check).
public record ProjectItemRequest(
    int? Id,
    DateTime? UpdatedAt,
    string Title,
    string Slug,
    string? Description,
    string? FullDescription,
    string? Category,
    string? Location,
    DateOnly? CompletionDate,
    int? FeaturedImageId,
    bool IsFeatured
);

public record UpdateProjectsRequest(List<ProjectItemRequest> Items, List<int>? DeletedIds);

// The public project page: ProjectResponse plus the full description.
public record ProjectDetailResponse(
    int Id,
    string Title,
    string Slug,
    string? Description,
    string? FullDescription,
    string? Category,
    string? Location,
    DateOnly? CompletionDate,
    int? FeaturedImageId,
    bool IsFeatured
);
