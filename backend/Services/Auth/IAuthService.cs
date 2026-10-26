using backend.Models;

public interface IAuthService
{
    Task<AdminUser?> ValidateCredentialsAsync(string email, string password);
}
