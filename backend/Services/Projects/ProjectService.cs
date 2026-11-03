using System.Linq.Expressions;
using System.Text.RegularExpressions;
using backend.Data;
using backend.DTOs.Projects;
using backend.Models;
using backend.Services.Common;
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

    // Trims the text; an empty text is stored as null.
    private static string? TrimOrNull(string? value)
    {
        var text = value?.Trim();

        if (string.IsNullOrEmpty(text))
        {
            return null;
        }

        return text;
    }

    private static bool IsTooLong(string? value, int maxLength)
    {
        var text = value?.Trim();

        return text is not null && text.Length > maxLength;
    }

    public async Task<ServiceResult<List<AdminProjectResponse>>> SaveAsync(
        UpdateProjectsRequest request
    )
    {
        if (request.Items is null)
        {
            return ServiceResult<List<AdminProjectResponse>>.BadRequest("Projects are required.");
        }

        var items = request.Items;
        var deletedIds = (request.DeletedIds ?? new List<int>()).Distinct().ToList();

        var ids = items.Where(i => i.Id is not null).Select(i => i.Id!.Value).ToList();

        if (ids.Count != ids.Distinct().Count())
        {
            return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                "A project was sent twice."
            );
        }

        if (ids.Any(deletedIds.Contains))
        {
            return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                "A project cannot be both kept and deleted."
            );
        }

        var slugs = new List<string>();

        foreach (var item in items)
        {
            var title = item.Title?.Trim() ?? "";

            if (title.Length == 0 || title.Length > 200)
            {
                return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                    "Every project needs a title of up to 200 characters."
                );
            }

            var slug = item.Slug?.Trim() ?? "";

            if (slug.Length == 0)
            {
                return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                    $"“{title}” needs a URL name (slug)."
                );
            }

            if (slug.Length > 220 || !SlugPattern.IsMatch(slug))
            {
                return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                    $"The URL name of “{title}” can only use lowercase letters, numbers and single hyphens (for example modern-residence)."
                );
            }

            if (slugs.Contains(slug))
            {
                return ServiceResult<List<AdminProjectResponse>>.Conflict(
                    $"The URL name “{slug}” is used by more than one project."
                );
            }

            slugs.Add(slug);

            if (IsTooLong(item.Description, 500))
            {
                return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                    "The short description must not exceed 500 characters."
                );
            }

            if (IsTooLong(item.FullDescription, 10000))
            {
                return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                    "The full description must not exceed 10000 characters."
                );
            }

            if (IsTooLong(item.Category, 100))
            {
                return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                    "The category must not exceed 100 characters."
                );
            }

            if (IsTooLong(item.Location, 200))
            {
                return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                    "The location must not exceed 200 characters."
                );
            }

            if (
                item.CompletionDate is { } date
                && (date.Year < 1900 || date.Year > DateTime.UtcNow.Year + 20)
            )
            {
                return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                    $"“{title}” has an invalid completion date."
                );
            }

            if (item.Id is not null && item.UpdatedAt is null)
            {
                return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                    "Reload the page and try again."
                );
            }
        }

        // Serialize concurrent saves: the rows stay locked until this transaction ends.
        await using var transaction = await _context.Database.BeginTransactionAsync();
        await _context.Database.ExecuteSqlRawAsync("SELECT `Id` FROM `Projects` FOR UPDATE");

        var existing = await _context.Projects.ToListAsync();

        if (ids.Any(id => existing.All(e => e.Id != id)))
        {
            return ServiceResult<List<AdminProjectResponse>>.Conflict(
                "A project was deleted by someone else. Reload the page."
            );
        }

        var untouched = existing
            .Where(e => !ids.Contains(e.Id) && !deletedIds.Contains(e.Id))
            .OrderBy(e => e.SortOrder)
            .ThenBy(e => e.Id)
            .ToList();
        var resultingCount = items.Count + untouched.Count;

        // The limit stops growth; data that is already above it can still be reduced.
        if (resultingCount > MaxProjects && resultingCount > existing.Count)
        {
            return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                $"A website can have at most {MaxProjects} projects."
            );
        }

        // A slug must be unique among the projects that remain.
        foreach (var other in untouched)
        {
            if (slugs.Contains(other.Slug))
            {
                return ServiceResult<List<AdminProjectResponse>>.Conflict(
                    $"The URL name “{other.Slug}” is already used by “{other.Title}”."
                );
            }
        }

        var imageIds = items
            .Where(i => i.FeaturedImageId is not null)
            .Select(i => i.FeaturedImageId!.Value)
            .Distinct()
            .ToList();
        var knownImages = await _context
            .MediaAssets.Where(m => imageIds.Contains(m.Id))
            .Select(m => m.Id)
            .ToListAsync();

        if (imageIds.Any(id => !knownImages.Contains(id)))
        {
            return ServiceResult<List<AdminProjectResponse>>.BadRequest(
                "A selected image no longer exists in the Media Library."
            );
        }

        foreach (var item in items.Where(i => i.Id is not null))
        {
            var entity = existing.First(e => e.Id == item.Id);

            if (!Timestamps.SameInstant(item.UpdatedAt!.Value, entity.UpdatedAt))
            {
                return ServiceResult<List<AdminProjectResponse>>.Conflict(
                    $"“{entity.Title}” was changed by someone else. Reload the page."
                );
            }
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
                var entity = isNew
                    ? new Project { CreatedAt = now }
                    : existing.First(e => e.Id == item.Id);

                if (isNew)
                {
                    _context.Projects.Add(entity);
                }

                entity.Title = item.Title.Trim();
                entity.Slug = item.Slug.Trim();
                entity.Description = TrimOrNull(item.Description);
                entity.FullDescription = TrimOrNull(item.FullDescription);
                entity.Category = TrimOrNull(item.Category);
                entity.Location = TrimOrNull(item.Location);
                entity.CompletionDate = item.CompletionDate;
                entity.FeaturedImageId = item.FeaturedImageId;
                entity.IsFeatured = item.IsFeatured;
                entity.SortOrder = ++order;

                if (isNew || _context.Entry(entity).State == EntityState.Modified)
                {
                    entity.UpdatedAt = now;
                }
            }

            // Projects the request did not mention keep their data and follow in order.
            foreach (var entity in untouched)
            {
                entity.SortOrder = ++order;

                if (_context.Entry(entity).State == EntityState.Modified)
                {
                    entity.UpdatedAt = now;
                }
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch (DbUpdateException)
        {
            // The unique slug index is the last guard (for example two projects swapping slugs).
            // The transaction is rolled back when it is disposed.
            return ServiceResult<List<AdminProjectResponse>>.Conflict(
                "A URL name is already in use. Choose different URL names and save again."
            );
        }

        return ServiceResult<List<AdminProjectResponse>>.Ok(await GetAllAdminAsync());
    }
}
