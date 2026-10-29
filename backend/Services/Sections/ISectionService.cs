using backend.DTOs.Sections;

namespace backend.Services.Sections;

public interface ISectionService
{
    Task<List<SectionResponse>> GetAllAsync();
    Task<List<SectionResponse>> GetVisibleAsync();
    Task<SectionResponse?> GetByIdAsync(Guid id);
    Task<bool> ReorderAsync(List<Guid> sectionIds);
    Task<bool> UpdateLayoutAsync(List<SectionLayoutItem> items);

    // 404 when the section does not exist, 400 for invalid content, 409 when the section was
    // changed after the admin loaded it.
    Task<ServiceResult<UpdateSectionContentResponse>> UpdateContentAsync(
        Guid id,
        UpdateSectionContentRequest request
    );
}
