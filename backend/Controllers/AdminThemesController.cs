using backend.DTOs.Themes;
using backend.Services.Themes;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/admin/themes")]
public class AdminThemesController : ControllerBase
{
    private readonly IThemeService _themeService;

    public AdminThemesController(IThemeService themeService)
    {
        _themeService = themeService;
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateThemeRequest request)
    {
        try
        {
            var theme = await _themeService.UpdateAsync(id, request);

            if (theme is null)
                return NotFound(new { message = "Theme not found." });

            return Ok(theme);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
        catch (InvalidOperationException exception)
        {
            return Conflict(new { message = exception.Message });
        }
    }

    [HttpPut("{id:int}/activate")]
    public async Task<IActionResult> Activate(int id)
    {
        var theme = await _themeService.ActivateAsync(id);

        if (theme is null)
            return NotFound(new { message = "Theme not found." });

        return Ok(theme);
    }
}
