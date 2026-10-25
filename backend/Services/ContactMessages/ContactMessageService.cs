using backend.Data;
using backend.DTOs.ContactMessages;
using backend.Models;
using Microsoft.EntityFrameworkCore;

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

    private static AdminContactMessageResponse ToAdminResponse(ContactMessage message) =>
        new(
            message.Id,
            message.Name,
            message.Email,
            message.Message,
            message.IsRead,
            message.CreatedAt
        );

    // Newest first.
    public async Task<List<AdminContactMessageResponse>> GetAllAsync()
    {
        var messages = await _context
            .ContactMessages.AsNoTracking()
            .OrderByDescending(message => message.CreatedAt)
            .ToListAsync();

        return messages.Select(ToAdminResponse).ToList();
    }

    public async Task<AdminContactMessageResponse?> SetReadAsync(Guid id, bool isRead)
    {
        var message = await _context.ContactMessages.FirstOrDefaultAsync(item => item.Id == id);

        if (message is null)
            return null;

        message.IsRead = isRead;
        await _context.SaveChangesAsync();

        return ToAdminResponse(message);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var deleted = await _context.ContactMessages.Where(item => item.Id == id).ExecuteDeleteAsync();

        return deleted > 0;
    }
}
