using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace backend.Middleware;

public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken
    )
    {
        // Expected problems (bad input, missing record, stale data) are ServiceResults and
        // never reach this handler. A request the server could not even read (for example a
        // body over the size limit) keeps its own 4xx status; everything else is a 500.
        var statusCode = exception is BadHttpRequestException badRequest
            ? badRequest.StatusCode
            : StatusCodes.Status500InternalServerError;

        if (statusCode == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(
                exception,
                "Unhandled exception occurred while processing {Path}",
                httpContext.Request.Path
            );
        }

        // The exception text can contain database or file details, so it is never sent.
        var message =
            statusCode == StatusCodes.Status500InternalServerError
                ? "An unexpected server error occurred."
                : "The request could not be processed.";

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = statusCode switch
            {
                StatusCodes.Status500InternalServerError => "Internal Server Error",
                _ => "Bad Request",
            },
            Detail = message,
            Instance = httpContext.Request.Path,
        };

        problem.Extensions["message"] = message;

        httpContext.Response.StatusCode = statusCode;

        await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);

        return true;
    }
}
