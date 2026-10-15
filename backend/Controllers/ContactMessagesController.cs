using backend.DTOs.ContactMessages;
using backend.Services.ContactMessages;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Route("api/contact-messages")]
public class ContactMessagesController : ControllerBase
{
    private readonly IContactMessageService _contactMessageService;

    public ContactMessagesController(IContactMessageService contactMessageService)
    {
        _contactMessageService = contactMessageService;
    }

    [HttpPost]
    [EnableRateLimiting("ContactSubmission")]
    public async Task<IActionResult> Create(CreateContactMessageRequest request)
    {
        var response = await _contactMessageService.CreateAsync(request);

        return StatusCode(StatusCodes.Status201Created, response);
    }
}
