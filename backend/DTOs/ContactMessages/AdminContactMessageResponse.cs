namespace backend.DTOs.ContactMessages;

public record AdminContactMessageResponse(
    Guid Id,
    string Name,
    string Email,
    string Message,
    bool IsRead,
    DateTime CreatedAt
);

public record SetMessageReadRequest(bool IsRead);
