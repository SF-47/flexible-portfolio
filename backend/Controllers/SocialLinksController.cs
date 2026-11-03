using backend.Services.SocialLinks;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/social-links")]
public class SocialLinksController : ControllerBase
{
    private readonly ISocialLinkService _socialLinkService;

    public SocialLinksController(ISocialLinkService socialLinkService)
    {
        _socialLinkService = socialLinkService;
    }

    [HttpGet]
    public async Task<IActionResult> GetVisible()
    {
        var links = await _socialLinkService.GetVisibleAsync();

        return Ok(links);
    }
}
