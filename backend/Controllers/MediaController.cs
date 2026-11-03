using backend.Services.Media;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/media")]
public class MediaController : ControllerBase
{
    private readonly IMediaService _mediaService;

    public MediaController(IMediaService mediaService)
    {
        _mediaService = mediaService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var media = await _mediaService.GetAllAsync();

        return Ok(media);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var media = await _mediaService.GetByIdAsync(id);

        if (media is null)
        {
            return NotFound(new { message = "Media asset not found." });
        }

        return Ok(media);
    }
}
