using backend.DTOs.Navigation;
using backend.DTOs.Sections;
using backend.DTOs.SocialLinks;
using backend.Models;
using backend.Services.Navigation;
using backend.Services.Sections;
using backend.Services.SocialLinks;

namespace Portfolio.Tests;

// A save made from an outdated browser tab must be refused with 409, never overwrite
// or delete what another administrator did.
public class StaleSaveTests
{
    [Fact]
    public async Task Social_links_save_from_a_stale_tab_returns_409_and_keeps_the_new_link()
    {
        using var database = new TestDatabase();
        using var context = database.CreateContext();
        context.SocialLinks.Add(
            new SocialLink
            {
                Platform = "Facebook",
                Url = "https://facebook.com/a",
                SortOrder = 1,
            }
        );
        context.SocialLinks.Add(
            new SocialLink
            {
                Platform = "GitHub",
                Url = "https://github.com/a",
                SortOrder = 2,
            }
        );
        await context.SaveChangesAsync();
        var service = new SocialLinkService(context);

        // The stale tab only knew about the Facebook link (id 1).
        var stale = await service.ReplaceAsync(
            new UpdateSocialLinksRequest(
                [new SocialLinkRequest(1, "Facebook", "https://facebook.com/b", true)],
                [1]
            )
        );

        Assert.False(stale.Success);
        Assert.Equal(409, stale.StatusCode);
        Assert.Equal(2, context.SocialLinks.Count());
    }

    [Fact]
    public async Task Social_links_save_with_current_ids_can_delete_and_validates_urls()
    {
        using var database = new TestDatabase();
        using var context = database.CreateContext();
        context.SocialLinks.Add(
            new SocialLink
            {
                Platform = "Facebook",
                Url = "https://facebook.com/a",
                SortOrder = 1,
            }
        );
        context.SocialLinks.Add(
            new SocialLink
            {
                Platform = "GitHub",
                Url = "https://github.com/a",
                SortOrder = 2,
            }
        );
        await context.SaveChangesAsync();
        var service = new SocialLinkService(context);

        var invalid = await service.ReplaceAsync(
            new UpdateSocialLinksRequest(
                [new SocialLinkRequest(1, "Facebook", "javascript:alert(1)", true)],
                [1, 2]
            )
        );
        var saved = await service.ReplaceAsync(
            new UpdateSocialLinksRequest(
                [new SocialLinkRequest(1, "Facebook", "https://facebook.com/b", true)],
                [1, 2]
            )
        );

        Assert.Equal(400, invalid.StatusCode);
        Assert.True(saved.Success);
        Assert.Single(context.SocialLinks);
    }

    [Fact]
    public async Task Navigation_save_that_misses_a_link_added_elsewhere_returns_409()
    {
        using var database = new TestDatabase();
        using var context = database.CreateContext();
        context.NavigationItems.Add(new NavigationItem { Label = "Home", SortOrder = 1 });
        context.NavigationItems.Add(new NavigationItem { Label = "About", SortOrder = 2 });
        await context.SaveChangesAsync();
        var service = new NavigationService(context);

        var stale = await service.ReplaceAsync(
            new UpdateNavigationRequest([new NavigationItemRequest(1, null, true)])
        );

        Assert.Equal(409, stale.StatusCode);
    }

    [Fact]
    public async Task Section_content_save_with_an_old_timestamp_returns_409_and_keeps_the_stored_content()
    {
        using var database = new TestDatabase();
        using var context = database.CreateContext();
        var section = new Section
        {
            Type = "hero",
            Name = "Hero",
            ContentJson =
                """{"title":"Original","tagline":"T","buttonLink":"#projects","buttonText":"Go","description":"D"}""",
            UpdatedAt = new DateTime(2026, 1, 2, 0, 0, 0, DateTimeKind.Utc),
        };
        context.Sections.Add(section);
        await context.SaveChangesAsync();
        var service = new SectionService(context);

        var stale = await service.UpdateContentAsync(
            section.Id,
            new UpdateSectionContentRequest(
                """{"title":"From a stale tab","tagline":"T","buttonLink":"#projects","buttonText":"Go","description":"D"}""",
                new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            )
        );

        Assert.Equal(409, stale.StatusCode);
        Assert.Contains("Original", context.Sections.Single().ContentJson);
    }
}
