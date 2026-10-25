namespace backend.DTOs.CompanyServices;

public record AdminServiceResponse(
    int Id,
    string Title,
    string Description,
    string? IconName,
    int? ImageMediaId,
    int SortOrder,
    bool IsActive,
    DateTime UpdatedAt
);

// Id is null for a new service. UpdatedAt is the value the admin loaded; a different value
// in the database means someone else changed the service (409). The position in the list
// becomes the SortOrder.
public record ServiceItemRequest(
    int? Id,
    DateTime? UpdatedAt,
    string Title,
    string Description,
    string? IconName,
    int? ImageMediaId,
    bool IsActive
);

// Items: every service the admin keeps, in the new order. DeletedIds: services the admin
// chose to delete (nothing is deleted just because it is missing from Items).
public record UpdateServicesRequest(List<ServiceItemRequest> Items, List<int>? DeletedIds);
