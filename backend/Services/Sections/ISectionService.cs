using backend.DTOs.Sections;

namespace backend.Services.Sections;

public interface ISectionService
{
    Task<List<SectionResponse>> GetAllAsync();
    Task<List<SectionResponse>> GetVisibleAsync();
    Task<SectionResponse?> GetByIdAsync(Guid id);
}
