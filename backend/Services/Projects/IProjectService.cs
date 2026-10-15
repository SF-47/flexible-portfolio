using backend.DTOs.Projects;

namespace backend.Services.Projects;

public interface IProjectService
{
    Task<List<ProjectResponse>> GetAllAsync();

    Task<ProjectResponse?> GetByIdAsync(int id);
}
