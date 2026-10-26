namespace backend.DTOs.Auth;

public record AdminProfileResponse(
    Guid Id,
    string FullName,
    string Email
);