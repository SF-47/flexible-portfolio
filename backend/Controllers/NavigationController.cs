using backend.Services.Navigation;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/navigation")]
public class NavigationController : ControllerBase
{
    private readonly INavigationService _navigationService;

    public NavigationController(INavigationService navigationService)
    {
        _navigationService = navigationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetVisible()
    {
        var items = await _navigationService.GetVisibleAsync();

        return Ok(items);
    }
}
