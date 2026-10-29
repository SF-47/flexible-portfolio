using System.Net;
using System.Net.Http.Json;

namespace Portfolio.Tests;

// Each class gets its own factory, so its rate-limit counters start at zero.
public class LoginRateLimitTests : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client;

    public LoginRateLimitTests(ApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Login_is_limited_to_10_attempts_and_a_spoofed_forwarded_header_does_not_reset_it()
    {
        for (var attempt = 1; attempt <= 10; attempt++)
        {
            // The test client is not a trusted proxy, so each header must be ignored.
            using var request = new HttpRequestMessage(HttpMethod.Post, "/api/auth/login")
            {
                Content = JsonContent.Create(
                    new { email = "nobody@example.com", password = "wrong" }
                ),
            };
            request.Headers.Add("X-Forwarded-For", $"203.0.113.{attempt}");

            var response = await _client.SendAsync(request);

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        using var eleventh = new HttpRequestMessage(HttpMethod.Post, "/api/auth/login")
        {
            Content = JsonContent.Create(new { email = "nobody@example.com", password = "wrong" }),
        };
        eleventh.Headers.Add("X-Forwarded-For", "198.51.100.77");

        var limited = await _client.SendAsync(eleventh);

        Assert.Equal(HttpStatusCode.TooManyRequests, limited.StatusCode);
    }
}

public class ContactRateLimitTests : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client;

    public ContactRateLimitTests(ApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Contact_form_accepts_5_messages_then_returns_429()
    {
        var message = new
        {
            name = "Visitor",
            email = "visitor@example.com",
            message = "Hello",
        };

        for (var count = 1; count <= 5; count++)
        {
            var response = await _client.PostAsJsonAsync("/api/contact-messages", message);

            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        }

        var limited = await _client.PostAsJsonAsync("/api/contact-messages", message);

        Assert.Equal(HttpStatusCode.TooManyRequests, limited.StatusCode);
    }
}
