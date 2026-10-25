using backend.Data;
using System.Text.RegularExpressions;
using backend.DTOs.CompanyServices;
using backend.Models;
using backend.Services.Common;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.CompanyServices;

public class CompanyServiceManager : ICompanyServiceManager
{
    private readonly AppDbContext _context;

    public CompanyServiceManager(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CompanyServiceResponse>> GetActiveAsync()
    {
        return await _context
            .Services.AsNoTracking()
            .Where(service => service.IsActive)
            .OrderBy(service => service.SortOrder)
            .Select(service => new CompanyServiceResponse(
                service.Id,
                service.Title,
                service.Description,
                service.IconName,
                service.ImageMediaId,
                service.SortOrder
            ))
            .ToListAsync();
    }

    public const int MaxServices = 6;

    private static readonly Regex IconPattern = new("^[A-Za-z][A-Za-z0-9]{0,63}$");

    private static AdminServiceResponse ToAdmin(Service service) =>
        new(
            service.Id,
            service.Title,
            service.Description,
            service.IconName,
            service.ImageMediaId,
            service.SortOrder,
            service.IsActive,
            service.UpdatedAt
        );

    public async Task<List<AdminServiceResponse>> GetAllAsync()
    {
        var services = await _context
            .Services.AsNoTracking()
            .OrderBy(service => service.SortOrder)
            .ThenBy(service => service.Id)
            .ToListAsync();

        return services.Select(ToAdmin).ToList();
    }

    public async Task<List<AdminServiceResponse>> SaveAsync(UpdateServicesRequest request)
    {
        var items = request.Items ?? throw new ArgumentException("Services are required.");
        var deletedIds = (request.DeletedIds ?? new List<int>()).Distinct().ToList();

        var ids = items.Where(i => i.Id is not null).Select(i => i.Id!.Value).ToList();

        if (ids.Count != ids.Distinct().Count())
            throw new ArgumentException("A service was sent twice.");

        if (ids.Any(deletedIds.Contains))
            throw new ArgumentException("A service cannot be both kept and deleted.");

        foreach (var item in items)
        {
            var title = item.Title?.Trim() ?? "";
            var description = item.Description?.Trim() ?? "";

            if (title.Length == 0 || title.Length > 150)
                throw new ArgumentException("Every service needs a title of up to 150 characters.");

            if (description.Length == 0 || description.Length > 600)
                throw new ArgumentException($"“{title}” needs a description of up to 600 characters.");

            if (!string.IsNullOrEmpty(item.IconName) && !IconPattern.IsMatch(item.IconName))
                throw new ArgumentException($"“{title}” has an invalid icon.");

            if (item.Id is not null && item.UpdatedAt is null)
                throw new ArgumentException("Reload the page and try again.");
        }

        // Serialize concurrent saves: the rows stay locked until this transaction ends.
        await using var transaction = await _context.Database.BeginTransactionAsync();
        await _context.Database.ExecuteSqlRawAsync("SELECT `Id` FROM `Services` FOR UPDATE");

        var existing = await _context.Services.ToListAsync();

        if (ids.Any(id => existing.All(e => e.Id != id)))
            throw new ConflictException("A service was deleted by someone else. Reload the page.");

        var untouched = existing
            .Where(e => !ids.Contains(e.Id) && !deletedIds.Contains(e.Id))
            .OrderBy(e => e.SortOrder)
            .ThenBy(e => e.Id)
            .ToList();
        var resultingCount = items.Count + untouched.Count;

        // The limit stops growth; data that is already above it can still be reduced.
        if (resultingCount > MaxServices && resultingCount > existing.Count)
            throw new ArgumentException($"A website can have at most {MaxServices} services.");

        var imageIds = items.Where(i => i.ImageMediaId is not null).Select(i => i.ImageMediaId!.Value).Distinct().ToList();
        var knownImages = await _context.MediaAssets.Where(m => imageIds.Contains(m.Id)).Select(m => m.Id).ToListAsync();

        if (imageIds.Any(id => !knownImages.Contains(id)))
            throw new ArgumentException("A selected image no longer exists in the Media Library.");

        foreach (var item in items.Where(i => i.Id is not null))
        {
            var entity = existing.First(e => e.Id == item.Id);

            if (!Timestamps.SameInstant(item.UpdatedAt!.Value, entity.UpdatedAt))
                throw new ConflictException($"“{entity.Title}” was changed by someone else. Reload the page.");
        }

        // Deleting a service never touches its image (the Media Library keeps the file).
        _context.Services.RemoveRange(existing.Where(e => deletedIds.Contains(e.Id)));

        var now = DateTime.UtcNow;
        var order = 0;

        foreach (var item in items)
        {
            var isNew = item.Id is null;
            var entity = isNew ? new Service { CreatedAt = now } : existing.First(e => e.Id == item.Id);

            if (isNew)
                _context.Services.Add(entity);

            entity.Title = item.Title.Trim();
            entity.Description = item.Description.Trim();
            entity.IconName = string.IsNullOrEmpty(item.IconName) ? null : item.IconName;
            entity.ImageMediaId = item.ImageMediaId;
            entity.IsActive = item.IsActive;
            entity.SortOrder = ++order;

            if (isNew || _context.Entry(entity).State == EntityState.Modified)
                entity.UpdatedAt = now;
        }

        // Services the request did not mention keep their data and follow in order.
        foreach (var entity in untouched)
        {
            entity.SortOrder = ++order;

            if (_context.Entry(entity).State == EntityState.Modified)
                entity.UpdatedAt = now;
        }

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return await GetAllAsync();
    }
}
