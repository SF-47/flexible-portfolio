using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.ContactMessages;

public class CreateContactMessageRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(254)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(3000)]
    public string Message { get; set; } = string.Empty;
}
