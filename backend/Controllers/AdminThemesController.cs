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
        var result = await _themeService.UpdateAsync(id, request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    [HttpPut("{id:int}/activate")]
    public async Task<IActionResult> Activate(int id)
    {
        var theme = await _themeService.ActivateAsync(id);

        if (theme is null)
        {
            return NotFound(new { message = "Theme not found." });
        }

        return Ok(theme);
    }
}
