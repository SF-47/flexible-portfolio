using backend.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging.Abstractions;

namespace Portfolio.Tests;

public class GlobalExceptionHandlerTests
{
    [Fact]
    public async Task Unexpected_exception_returns_500_with_a_generic_message()
    {
        var handler = new GlobalExceptionHandler(NullLogger<GlobalExceptionHandler>.Instance);
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        var handled = await handler.TryHandleAsync(
            context,
            new InvalidOperationException("Table 'portfolio.Users' password=secret"),
            CancellationToken.None
        );

        context.Response.Body.Position = 0;
        var body = await new StreamReader(context.Response.Body).ReadToEndAsync();

        Assert.True(handled);
        Assert.Equal(500, context.Response.StatusCode);
        Assert.Contains("An unexpected server error occurred.", body);
        Assert.DoesNotContain("secret", body);
        Assert.DoesNotContain("Table", body);
    }

    [Fact]
    public async Task Unreadable_request_keeps_its_4xx_status_without_exception_details()
    {
        var handler = new GlobalExceptionHandler(NullLogger<GlobalExceptionHandler>.Instance);
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        await handler.TryHandleAsync(
            context,
            new BadHttpRequestException("internal detail", StatusCodes.Status413PayloadTooLarge),
            CancellationToken.None
        );

        context.Response.Body.Position = 0;
        var body = await new StreamReader(context.Response.Body).ReadToEndAsync();

        Assert.Equal(413, context.Response.StatusCode);
        Assert.DoesNotContain("internal detail", body);
    }
}
