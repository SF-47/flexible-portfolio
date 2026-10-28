using System.Net;
using backend.Services.Common;
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
        var statusCode = exception switch
        {
            ArgumentException => StatusCodes.Status400BadRequest, //this means : If the exception is an ArgumentException, return 400.
            ConflictException => StatusCodes.Status409Conflict,   //this means : If the exception is an ConflictException, return 409.
            _ => StatusCodes.Status500InternalServerError,        // _ means every other exception
        };

        if (statusCode == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(
                exception,
                "Unhandled exception occurred while processing {Path}",
                httpContext.Request.Path
            );
        }

        var message =
            statusCode == StatusCodes.Status500InternalServerError
                ? "An unexpected server error occurred."
                : exception.Message;

        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = statusCode switch
            {
                StatusCodes.Status400BadRequest => "Bad Request",
                StatusCodes.Status409Conflict => "Conflict",
                _ => "Internal Server Error",
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
