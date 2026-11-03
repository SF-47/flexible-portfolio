using backend.Data;
using backend.DTOs.SocialLinks;
using backend.Models;
using backend.Services.Common;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.SocialLinks;

public class SocialLinkService : ISocialLinkService
{
    private readonly AppDbContext _context;

    public SocialLinkService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<SocialLinkResponse>> GetVisibleAsync()
    {
        return await _context
            .SocialLinks.AsNoTracking()
            .Where(link => link.IsVisible)
            .OrderBy(link => link.SortOrder)
            .Select(link => new SocialLinkResponse(
                link.Id,
                link.Platform,
                link.Url,
                link.SortOrder
            ))
            .ToListAsync();
    }

    private const int MaxItems = 12;

    // The platforms the public footer has an icon for.
    private static readonly Dictionary<string, string> Platforms = new(
        StringComparer.OrdinalIgnoreCase
    )
    {
        ["facebook"] = "Facebook",
        ["instagram"] = "Instagram",
        ["linkedin"] = "LinkedIn",
        ["youtube"] = "YouTube",
        ["tiktok"] = "TikTok",
        ["x"] = "X",
        ["twitter"] = "Twitter",
        ["whatsapp"] = "WhatsApp",
        ["telegram"] = "Telegram",
        ["github"] = "GitHub",
    };

    public async Task<List<AdminSocialLinkResponse>> GetAllAsync()
    {
        return await _context
            .SocialLinks.AsNoTracking()
            .OrderBy(link => link.SortOrder)
            .Select(link => new AdminSocialLinkResponse(
                link.Id,
                link.Platform,
                link.Url,
                link.SortOrder,
                link.IsVisible
            ))
            .ToListAsync();
    }

    // Replaces the whole list in one SaveChanges call (a single transaction).
    public async Task<ServiceResult<List<AdminSocialLinkResponse>>> ReplaceAsync(
        UpdateSocialLinksRequest request
    )
    {
        if (request.Items is null || request.LoadedIds is null)
        {
            return ServiceResult<List<AdminSocialLinkResponse>>.BadRequest(
                "Social links are required."
            );
        }

        var items = request.Items;

        if (items.Count > MaxItems)
        {
            return ServiceResult<List<AdminSocialLinkResponse>>.BadRequest(
                $"A website can have at most {MaxItems} social links."
            );
        }

        var ids = items.Where(i => i.Id is not null).Select(i => i.Id!.Value).ToList();

        if (ids.Count != ids.Distinct().Count())
        {
            return ServiceResult<List<AdminSocialLinkResponse>>.BadRequest(
                "A social link was sent twice."
            );
        }

        var existing = await _context.SocialLinks.ToListAsync();

        // Another administrator added or deleted a link since this page was loaded.
        var existingIds = existing.Select(e => e.Id).ToHashSet();

        if (!existingIds.SetEquals(request.LoadedIds))
        {
            return ServiceResult<List<AdminSocialLinkResponse>>.Conflict(
                "The social links were changed by someone else. Reload the page."
            );
        }

        if (ids.Any(id => !existingIds.Contains(id)))
        {
            return ServiceResult<List<AdminSocialLinkResponse>>.BadRequest(
                "A social link no longer exists. Reload the page."
            );
        }

        // Known platforms use their canonical name; any other name is a custom platform
        // (shown with a generic icon). Platforms cannot be listed twice.
        var platforms = new List<string>();

        foreach (var item in items)
        {
            var name = item.Platform?.Trim() ?? "";

            if (
                name.Length == 0
                || name.Length > 50
                || name.Any(char.IsControl)
                || name.Any(c => c is '<' or '>')
            )
            {
                return ServiceResult<List<AdminSocialLinkResponse>>.BadRequest(
                    "Enter a platform name of up to 50 characters."
                );
            }

            var platform = Platforms.TryGetValue(name, out var known) ? known : name;

            if (platforms.Contains(platform, StringComparer.OrdinalIgnoreCase))
            {
                return ServiceResult<List<AdminSocialLinkResponse>>.BadRequest(
                    $"{platform} is already in the list."
                );
            }

            platforms.Add(platform);

            if (!HttpUrl.IsValid(item.Url))
            {
                return ServiceResult<List<AdminSocialLinkResponse>>.BadRequest(
                    $"{platform} needs a valid http:// or https:// address."
                );
            }
        }

        _context.SocialLinks.RemoveRange(existing.Where(e => !ids.Contains(e.Id)));

        for (var index = 0; index < items.Count; index++)
        {
            var item = items[index];
            var entity = item.Id is null ? new SocialLink() : existing.First(e => e.Id == item.Id);

            if (item.Id is null)
            {
                _context.SocialLinks.Add(entity);
            }

            entity.Platform = platforms[index];
            entity.Url = item.Url;
            entity.IsVisible = item.IsVisible;
            entity.SortOrder = index + 1;
        }

        await _context.SaveChangesAsync();

        return ServiceResult<List<AdminSocialLinkResponse>>.Ok(await GetAllAsync());
    }
}
