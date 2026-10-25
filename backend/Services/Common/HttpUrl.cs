namespace backend.Services.Common;

public static class HttpUrl
{
    // Only absolute http(s) URLs are accepted, never javascript:, data: and the like.
    public static bool IsValid(string? value, int maxLength = 2048) =>
        !string.IsNullOrWhiteSpace(value)
        && value.Length <= maxLength
        && Uri.TryCreate(value, UriKind.Absolute, out var uri)
        && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps)
        && !string.IsNullOrEmpty(uri.Host);
}
