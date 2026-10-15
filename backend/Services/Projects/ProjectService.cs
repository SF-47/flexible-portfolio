using System.Linq.Expressions;
using backend.Data;
using backend.DTOs.Projects;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Projects;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _context;

    public ProjectService(AppDbContext context)
    {
        _context = context;
    }

    private static readonly Expression<Func<Project, ProjectResponse>> ProjectProjection =
        project => new ProjectResponse(
            project.Id,
            project.Title,
            project.Slug,
            project.Description,
            project.Category,
            project.Location,
            project.CompletionDate,
            project.FeaturedImageId,
            project.IsFeatured,
            project.SortOrder
        );

    public async Task<List<ProjectResponse>> GetAllAsync()
    {
        return await _context
            .Projects.AsNoTracking()
            .OrderBy(project => project.SortOrder)
            .Select(ProjectProjection)
            .ToListAsync();
    }

    public async Task<ProjectResponse?> GetByIdAsync(int id)
    {
        return await _context
            .Projects.AsNoTracking()
            .Where(project => project.Id == id)
            .Select(ProjectProjection)
            .FirstOrDefaultAsync();
    }
}
