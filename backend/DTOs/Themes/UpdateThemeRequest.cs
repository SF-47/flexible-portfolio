using System.ComponentModel.DataAnnotations;

namespace backend.DTOs.Themes;

public record UpdateThemeRequest(
    [Required, RegularExpression("^#[0-9a-fA-F]{6}$")] string PrimaryColor,
    [Required, RegularExpression("^#[0-9a-fA-F]{6}$")] string AccentColor,
    [Required, RegularExpression("^#[0-9a-fA-F]{6}$")] string BackgroundColor,
    [Required, RegularExpression("^#[0-9a-fA-F]{6}$")] string TextColor,
    [Required, RegularExpression("^#[0-9a-fA-F]{6}$")] string OnPrimaryColor,
    [Required, RegularExpression("^#[0-9a-fA-F]{6}$")] string OnAccentColor,
    [Required] string HeadingFont,
    [Required] string BodyFont,
    [Required] string NavbarVariant
);
