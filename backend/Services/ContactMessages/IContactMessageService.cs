using backend.DTOs.ContactMessages;

namespace backend.Services.ContactMessages;

public interface IContactMessageService
{
    Task<ContactMessageResponse> CreateAsync(CreateContactMessageRequest request);
}
