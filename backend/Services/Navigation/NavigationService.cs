using backend.Data;
using backend.DTOs.Navigation;
using backend.Models;
using backend.Services.Common;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Navigation;

public class NavigationService : INavigationService
{
    private readonly AppDbContext _context;

    public NavigationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<NavigationResponse>> GetVisibleAsync()
    {
        return await _context
            .NavigationItems.AsNoTracking()
            .Where(item => item.IsVisible)
            .Where(item => item.SectionId == null || item.Section!.IsVisible)
            .OrderBy(item => item.SortOrder)
            .Select(item => new NavigationResponse(
                item.Id,
                item.Label,
                item.LinkType,
                item.SectionId,
                item.Section != null ? item.Section.Type : null,
                item.Url,
                item.SortOrder,
                item.OpenInNewTab
            ))
            .ToListAsync();
    }

    public async Task<List<AdminNavigationItemResponse>> GetAllAsync()
    {
        return await _context
            .NavigationItems.AsNoTracking()
            .OrderBy(item => item.SortOrder)
            .Select(item => new AdminNavigationItemResponse(
                item.Id,
                item.Label,
                item.LinkType,
                item.SectionId,
                item.Url,
                item.SortOrder,
                item.IsVisible,
                item.OpenInNewTab
            ))
            .ToListAsync();
    }

    // The short names the menu uses for the predefined sections.
    private static readonly Dictionary<string, string> Labels = new()
    {
        ["hero"] = "Home",
        ["about"] = "About",
        ["stats"] = "Stats",
        ["services"] = "Services",
        ["projects"] = "Projects",
        ["whyChooseUs"] = "Why Us",
        ["process"] = "Process",
        ["gallery"] = "Gallery",
        ["team"] = "Team",
        ["clients"] = "Clients",
        ["testimonials"] = "Testimonials",
        ["certifications"] = "Certifications",
        ["faq"] = "FAQ",
        ["cta"] = "Get Started",
        ["contact"] = "Contact",
    };

    // Saves visibility and order in one SaveChanges call (a single transaction). Existing
    // links keep their stored name and destination and are never deleted. A predefined
    // section without a link can be added; a section can only have one new link.
    public async Task<ServiceResult<List<AdminNavigationItemResponse>>> ReplaceAsync(
        UpdateNavigationRequest request
    )
    {
        if (request.Items is null)
        {
            return ServiceResult<List<AdminNavigationItemResponse>>.BadRequest(
                "Navigation links are required."
            );
        }

        var items = request.Items;

        var ids = items.Where(i => i.Id is not null).Select(i => i.Id!.Value).ToList();

        if (ids.Count != ids.Distinct().Count())
        {
            return ServiceResult<List<AdminNavigationItemResponse>>.BadRequest(
                "A navigation link was sent twice."
            );
        }

        var existing = await _context.NavigationItems.ToListAsync();

        if (ids.Any(id => existing.All(e => e.Id != id)))
        {
            return ServiceResult<List<AdminNavigationItemResponse>>.Conflict(
                "A navigation link no longer exists. Reload the page."
            );
        }

        if (existing.Any(e => !ids.Contains(e.Id)))
        {
            return ServiceResult<List<AdminNavigationItemResponse>>.Conflict(
                "The navigation changed in the meantime. Reload the page."
            );
        }

        var added = items.Where(i => i.Id is null).ToList();
        var addedSectionIds = added.Select(i => i.SectionId).ToList();

        if (added.Any(i => i.SectionId is null))
        {
            return ServiceResult<List<AdminNavigationItemResponse>>.BadRequest(
                "Choose a website section for the new link."
            );
        }

        if (addedSectionIds.Count != addedSectionIds.Distinct().Count())
        {
            return ServiceResult<List<AdminNavigationItemResponse>>.BadRequest(
                "A website section can only be added once."
            );
        }

        var sections = await _context
            .Sections.Where(s => addedSectionIds.Contains(s.Id))
            .ToDictionaryAsync(s => s.Id);

        foreach (var item in added)
        {
            if (
                !sections.TryGetValue(item.SectionId!.Value, out var section)
                || !Labels.ContainsKey(section.Type)
            )
            {
                return ServiceResult<List<AdminNavigationItemResponse>>.BadRequest(
                    "A new link points to a section that does not exist."
                );
            }

            if (existing.Any(e => e.SectionId == section.Id))
            {
                return ServiceResult<List<AdminNavigationItemResponse>>.BadRequest(
                    $"\"{Labels[section.Type]}\" is already in the menu."
                );
            }
        }

        for (var index = 0; index < items.Count; index++)
        {
            var item = items[index];
            NavigationItem entity;

            if (item.Id is null)
            {
                var section = sections[item.SectionId!.Value];

                entity = new NavigationItem
                {
                    Label = Labels[section.Type],
                    LinkType = "section",
                    SectionId = section.Id,
                    OpenInNewTab = false,
                };
                _context.NavigationItems.Add(entity);
            }
            else
            {
                entity = existing.First(e => e.Id == item.Id);
            }

            entity.IsVisible = item.IsVisible;
            entity.SortOrder = index + 1;
        }

        await _context.SaveChangesAsync();

        return ServiceResult<List<AdminNavigationItemResponse>>.Ok(await GetAllAsync());
    }
}
