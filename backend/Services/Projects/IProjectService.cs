using backend.DTOs.Projects;

namespace backend.Services.Projects;

public interface IProjectService
{
    Task<List<ProjectResponse>> GetAllAsync();

    Task<ProjectResponse?> GetByIdAsync(int id);

    // Public project page.
    Task<ProjectDetailResponse?> GetBySlugAsync(string slug);

    // Admin: every project with its full description and timestamp.
    Task<List<AdminProjectResponse>> GetAllAdminAsync();

    // Admin: add, edit, reorder, feature and delete in one transaction. Throws
    // ArgumentException (400) for invalid input and ConflictException (409) for stale data
    // or a duplicate slug.
    Task<List<AdminProjectResponse>> SaveAsync(UpdateProjectsRequest request);
}
