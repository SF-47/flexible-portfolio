using backend.DTOs.Media;
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
        var result = await _mediaService.UploadAsync(file, altText);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var media = await _mediaService.GetAllWithUsageAsync();

        return Ok(media);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAltText(int id, [FromBody] UpdateMediaRequest request)
    {
        var result = await _mediaService.UpdateAltTextAsync(id, request.AltText);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _mediaService.DeleteAsync(id);

        if (!result.Success)
        {
            // An image that is still used answers with the places that use it.
            if (result.StatusCode == StatusCodes.Status409Conflict)
            {
                return Conflict(new { message = result.ErrorMessage, usedIn = result.Data });
            }

            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return NoContent();
    }
}
