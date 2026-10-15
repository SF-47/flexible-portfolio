using backend.Data;
using backend.DTOs.ContactMessages;
using backend.Models;

namespace backend.Services.ContactMessages;

public class ContactMessageService : IContactMessageService
{
    private readonly AppDbContext _context;

    public ContactMessageService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ContactMessageResponse> CreateAsync(CreateContactMessageRequest request)
    {
        var contactMessage = new ContactMessage
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim(),
            Message = request.Message.Trim(),
        };

        await _context.ContactMessages.AddAsync(contactMessage);
        await _context.SaveChangesAsync();

        return new ContactMessageResponse("Your message has been received.");
    }
}
