namespace backend.DTOs.CompanyServices;

public record CompanyServiceResponse(
    int Id,
    string Title,
    string Description,
    string? IconName,
    int? ImageMediaId,
    int SortOrder
);
