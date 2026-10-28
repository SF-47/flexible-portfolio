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
        var media = await _mediaService.UploadAsync(file, altText);
        return Ok(media);
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
        var media = await _mediaService.UpdateAltTextAsync(id, request.AltText);

        if (media is null)
        {
            return NotFound(new { message = "Media asset not found." });
        }

        return Ok(media);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _mediaService.DeleteAsync(id);

        switch (result.Status)
        {
            case DeleteMediaStatus.Deleted:
                return NoContent();

            case DeleteMediaStatus.NotFound:
                return NotFound(new { message = "Media asset not found." });

            default:
                return Conflict(
                    new
                    {
                        message = "Cannot delete this image because it is used in "
                            + JoinPlaces(result.UsedIn)
                            + ".",
                        usedIn = result.UsedIn,
                    }
                );
        }
    }

    private static string JoinPlaces(List<string> places)
    {
        if (places.Count <= 1)
        {
            return string.Join("", places);
        }

        return string.Join(", ", places.Take(places.Count - 1)) + " and " + places[^1];
    }
}
