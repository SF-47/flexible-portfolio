using backend.DTOs.ContactMessages;

namespace backend.Services.ContactMessages;

public interface IContactMessageService
{
    Task<ContactMessageResponse> CreateAsync(CreateContactMessageRequest request);

    Task<List<AdminContactMessageResponse>> GetAllAsync();

    Task<AdminContactMessageResponse?> SetReadAsync(Guid id, bool isRead);

    Task<bool> DeleteAsync(Guid id);
}
