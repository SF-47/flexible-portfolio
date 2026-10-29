using System.Net;
using backend.Services.Auth;

namespace Portfolio.Tests;

public class AdminAuthorizationTests : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client;

    public AdminAuthorizationTests(ApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Theory]
    [InlineData("/api/admin/dashboard/stats")]
    [InlineData("/api/admin/sections")]
    [InlineData("/api/admin/navigation")]
    [InlineData("/api/admin/social-links")]
    [InlineData("/api/admin/services")]
    [InlineData("/api/admin/projects")]
    [InlineData("/api/admin/media")]
    [InlineData("/api/admin/messages")]
    [InlineData("/api/auth/me")]
    public async Task Admin_endpoints_without_a_session_return_401(string url)
    {
        var response = await _client.GetAsync(url);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/sections")]
    [InlineData("/api/navigation")]
    [InlineData("/api/social-links")]
    [InlineData("/api/site-settings", HttpStatusCode.OK, HttpStatusCode.NotFound)]
    public async Task Public_endpoints_stay_open(
        string url,
        HttpStatusCode first = HttpStatusCode.OK,
        HttpStatusCode second = HttpStatusCode.OK
    )
    {
        var response = await _client.GetAsync(url);

        Assert.True(response.StatusCode == first || response.StatusCode == second);
    }

    [Theory]
    [InlineData("api/admin", true)]
    [InlineData("/api/admin/media", true)]
    [InlineData("~/api/admin/sections/{id}", true)]
    [InlineData("api/administrators", false)]
    [InlineData("api/media", false)]
    [InlineData(null, false)]
    public void IsAdminTemplate_matches_only_the_admin_prefix(string? template, bool expected)
    {
        Assert.Equal(expected, AdminAuthorization.IsAdminTemplate(template));
    }
}
