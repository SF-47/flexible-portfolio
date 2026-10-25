using System.Linq.Expressions;
using backend.Data;
using System.Text.RegularExpressions;
using backend.DTOs.Projects;
using backend.Services.Common;
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

    public const int MaxProjects = 6;

    // lowercase words joined by single hyphens, e.g. "modern-residence"
    private static readonly Regex SlugPattern = new("^[a-z0-9]+(-[a-z0-9]+)*$");

    public async Task<ProjectDetailResponse?> GetBySlugAsync(string slug)
    {
        return await _context
            .Projects.AsNoTracking()
            .Where(project => project.Slug == slug)
            .Select(project => new ProjectDetailResponse(
                project.Id,
                project.Title,
                project.Slug,
                project.Description,
                project.FullDescription,
                project.Category,
                project.Location,
                project.CompletionDate,
                project.FeaturedImageId,
                project.IsFeatured
            ))
            .FirstOrDefaultAsync();
    }

    private static AdminProjectResponse ToAdmin(Project project) =>
        new(
            project.Id,
            project.Title,
            project.Slug,
            project.Description,
            project.FullDescription,
            project.Category,
            project.Location,
            project.CompletionDate,
            project.FeaturedImageId,
            project.IsFeatured,
            project.SortOrder,
            project.UpdatedAt
        );

    public async Task<List<AdminProjectResponse>> GetAllAdminAsync()
    {
        var projects = await _context
            .Projects.AsNoTracking()
            .OrderBy(project => project.SortOrder)
            .ThenBy(project => project.Id)
            .ToListAsync();

        return projects.Select(ToAdmin).ToList();
    }

    private static string? Clean(string? value, int max, string field)
    {
        var text = value?.Trim();

        if (string.IsNullOrEmpty(text))
            return null;

        if (text.Length > max)
            throw new ArgumentException($"{field} must not exceed {max} characters.");

        return text;
    }

    public async Task<List<AdminProjectResponse>> SaveAsync(UpdateProjectsRequest request)
    {
        var items = request.Items ?? throw new ArgumentException("Projects are required.");
        var deletedIds = (request.DeletedIds ?? new List<int>()).Distinct().ToList();

        var ids = items.Where(i => i.Id is not null).Select(i => i.Id!.Value).ToList();

        if (ids.Count != ids.Distinct().Count())
            throw new ArgumentException("A project was sent twice.");

        if (ids.Any(deletedIds.Contains))
            throw new ArgumentException("A project cannot be both kept and deleted.");

        var slugs = new List<string>();

        foreach (var item in items)
        {
            var title = item.Title?.Trim() ?? "";

            if (title.Length == 0 || title.Length > 200)
                throw new ArgumentException("Every project needs a title of up to 200 characters.");

            var slug = item.Slug?.Trim() ?? "";

            if (slug.Length == 0)
                throw new ArgumentException($"“{title}” needs a URL name (slug).");

            if (slug.Length > 220 || !SlugPattern.IsMatch(slug))
                throw new ArgumentException(
                    $"The URL name of “{title}” can only use lowercase letters, numbers and single hyphens (for example modern-residence)."
                );

            if (slugs.Contains(slug))
                throw new ConflictException($"The URL name “{slug}” is used by more than one project.");

            slugs.Add(slug);

            Clean(item.Description, 500, "The short description");
            Clean(item.FullDescription, 10000, "The full description");
            Clean(item.Category, 100, "The category");
            Clean(item.Location, 200, "The location");

            if (item.CompletionDate is { } date && (date.Year < 1900 || date.Year > DateTime.UtcNow.Year + 20))
                throw new ArgumentException($"“{title}” has an invalid completion date.");

            if (item.Id is not null && item.UpdatedAt is null)
                throw new ArgumentException("Reload the page and try again.");
        }

        // Serialize concurrent saves: the rows stay locked until this transaction ends.
        await using var transaction = await _context.Database.BeginTransactionAsync();
        await _context.Database.ExecuteSqlRawAsync("SELECT `Id` FROM `Projects` FOR UPDATE");

        var existing = await _context.Projects.ToListAsync();

        if (ids.Any(id => existing.All(e => e.Id != id)))
            throw new ConflictException("A project was deleted by someone else. Reload the page.");

        var untouched = existing
            .Where(e => !ids.Contains(e.Id) && !deletedIds.Contains(e.Id))
            .OrderBy(e => e.SortOrder)
            .ThenBy(e => e.Id)
            .ToList();
        var resultingCount = items.Count + untouched.Count;

        // The limit stops growth; data that is already above it can still be reduced.
        if (resultingCount > MaxProjects && resultingCount > existing.Count)
            throw new ArgumentException($"A website can have at most {MaxProjects} projects.");

        // A slug must be unique among the projects that remain.
        foreach (var other in untouched)
        {
            if (slugs.Contains(other.Slug))
                throw new ConflictException($"The URL name “{other.Slug}” is already used by “{other.Title}”.");
        }

        var imageIds = items.Where(i => i.FeaturedImageId is not null).Select(i => i.FeaturedImageId!.Value).Distinct().ToList();
        var knownImages = await _context.MediaAssets.Where(m => imageIds.Contains(m.Id)).Select(m => m.Id).ToListAsync();

        if (imageIds.Any(id => !knownImages.Contains(id)))
            throw new ArgumentException("A selected image no longer exists in the Media Library.");

        foreach (var item in items.Where(i => i.Id is not null))
        {
            var entity = existing.First(e => e.Id == item.Id);

            if (!Timestamps.SameInstant(item.UpdatedAt!.Value, entity.UpdatedAt))
                throw new ConflictException($"“{entity.Title}” was changed by someone else. Reload the page.");
        }

        try
        {
            // Deletes go first so a new project can reuse the slug of a deleted one.
            // The image files are never touched.
            var removed = existing.Where(e => deletedIds.Contains(e.Id)).ToList();

            if (removed.Count > 0)
            {
                _context.Projects.RemoveRange(removed);
                await _context.SaveChangesAsync();
            }

            var now = DateTime.UtcNow;
            var order = 0;

            foreach (var item in items)
            {
                var isNew = item.Id is null;
                var entity = isNew ? new Project { CreatedAt = now } : existing.First(e => e.Id == item.Id);

                if (isNew)
                    _context.Projects.Add(entity);

                entity.Title = item.Title.Trim();
                entity.Slug = item.Slug.Trim();
                entity.Description = Clean(item.Description, 500, "The short description");
                entity.FullDescription = Clean(item.FullDescription, 10000, "The full description");
                entity.Category = Clean(item.Category, 100, "The category");
                entity.Location = Clean(item.Location, 200, "The location");
                entity.CompletionDate = item.CompletionDate;
                entity.FeaturedImageId = item.FeaturedImageId;
                entity.IsFeatured = item.IsFeatured;
                entity.SortOrder = ++order;

                if (isNew || _context.Entry(entity).State == EntityState.Modified)
                    entity.UpdatedAt = now;
            }

            // Projects the request did not mention keep their data and follow in order.
            foreach (var entity in untouched)
            {
                entity.SortOrder = ++order;

                if (_context.Entry(entity).State == EntityState.Modified)
                    entity.UpdatedAt = now;
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (DbUpdateException)
        {
            // The unique slug index is the last guard (for example two projects swapping slugs).
            throw new ConflictException("A URL name is already in use. Choose different URL names and save again.");
        }

        return await GetAllAdminAsync();
    }
}
