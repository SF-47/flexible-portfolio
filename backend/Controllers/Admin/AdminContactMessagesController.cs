using backend.DTOs.ContactMessages;
using backend.Services.ContactMessages;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/admin/messages")]
public class AdminContactMessagesController : ControllerBase
{
    private readonly IContactMessageService _contactMessageService;

    public AdminContactMessagesController(IContactMessageService contactMessageService)
    {
        _contactMessageService = contactMessageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _contactMessageService.GetAllAsync());

    [HttpPut("{id:guid}/read")]
    public async Task<IActionResult> SetRead(Guid id, [FromBody] SetMessageReadRequest request)
    {
        var message = await _contactMessageService.SetReadAsync(id, request.IsRead);

        if (message is null)
            return NotFound(new { message = "Message not found." });

        return Ok(message);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        if (!await _contactMessageService.DeleteAsync(id))
            return NotFound(new { message = "Message not found." });

        return NoContent();
    }
}
