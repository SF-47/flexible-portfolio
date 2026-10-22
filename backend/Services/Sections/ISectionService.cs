using backend.DTOs.Sections;

namespace backend.Services.Sections;

public interface ISectionService
{
    Task<List<SectionResponse>> GetAllAsync();
    Task<List<SectionResponse>> GetVisibleAsync();
    Task<SectionResponse?> GetByIdAsync(Guid id);
    Task<bool> ReorderAsync(List<Guid> sectionIds);
    Task<bool> UpdateLayoutAsync(List<SectionLayoutItem> items);
    Task<SectionResponse?> UpdateContentAsync(
        Guid id,
        string contentJson,
        DateTime? expectedUpdatedAt
    );
}
