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

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _mediaService.GetAllWithUsageAsync());

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateAltText(int id, [FromBody] UpdateMediaRequest request)
    {
        try
        {
            var media = await _mediaService.UpdateAltTextAsync(id, request.AltText);

            return media is null ? NotFound(new { message = "Media asset not found." }) : Ok(media);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _mediaService.DeleteAsync(id);

            return result.Status switch
            {
                DeleteMediaStatus.Deleted => NoContent(),
                DeleteMediaStatus.NotFound => NotFound(new { message = "Media asset not found." }),
                _ => Conflict(
                    new
                    {
                        message = "Cannot delete this image because it is used in "
                            + JoinPlaces(result.UsedIn)
                            + ".",
                        usedIn = result.UsedIn,
                    }
                ),
            };
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not delete the image." });
        }
    }

    private static string JoinPlaces(List<string> places) =>
        places.Count <= 1
            ? string.Join("", places)
            : string.Join(", ", places.Take(places.Count - 1)) + " and " + places[^1];
}
