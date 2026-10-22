using backend.Services.Media;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/admin/media")]
public class AdminMediaController : ControllerBase
{
    private readonly IMediaService _mediaService;

    public AdminMediaController(IMediaService mediaService)
    {
        _mediaService = mediaService;
    }

    [HttpPost]
    [RequestSizeLimit(6 * 1024 * 1024)]
    public async Task<IActionResult> Upload(IFormFile file, [FromForm] string? altText)
    {
        try
        {
            var media = await _mediaService.UploadAsync(file, altText);

            return Ok(media);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }
}
