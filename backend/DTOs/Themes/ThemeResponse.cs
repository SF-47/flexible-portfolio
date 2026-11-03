namespace backend.DTOs.Themes;

public record ThemeResponse(
    int Id,
    string Name,
    string PrimaryColor,
    string AccentColor,
    string BackgroundColor,
    string TextColor,
    string OnPrimaryColor,
    string OnAccentColor,
    string HeadingFont,
    string BodyFont,
    string NavbarVariant,
    bool IsActive,
    bool IsCustom
);
