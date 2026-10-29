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
    public async Task<IActionResult> GetAll()
    {
        var messages = await _contactMessageService.GetAllAsync();

        return Ok(messages);
    }

    [HttpPut("{id:guid}/read")]
    public async Task<IActionResult> SetRead(Guid id, [FromBody] SetMessageReadRequest request)
    {
        var message = await _contactMessageService.SetReadAsync(id, request.IsRead);

        if (message is null)
        {
            return NotFound(new { message = "Message not found." });
        }

        return Ok(message);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _contactMessageService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new { message = "Message not found." });
        }

        return NoContent();
    }
}
