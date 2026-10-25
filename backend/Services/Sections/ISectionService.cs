using backend.DTOs.Sections;

namespace backend.Services.Sections;

public interface ISectionService
{
    Task<List<SectionResponse>> GetAllAsync();
    Task<List<SectionResponse>> GetVisibleAsync();
    Task<SectionResponse?> GetByIdAsync(Guid id);
    Task<bool> ReorderAsync(List<Guid> sectionIds);
    Task<bool> UpdateLayoutAsync(List<SectionLayoutItem> items);
    Task<UpdateContentResult> UpdateContentAsync(Guid id, UpdateSectionContentRequest request);
}

public enum UpdateContentStatus
{
    Success,
    NotFound,
    Invalid,
    Conflict,
}

public record UpdateContentResult(
    UpdateContentStatus Status,
    string? Error = null,
    UpdateSectionContentResponse? Saved = null
);
