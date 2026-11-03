using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Routing;

namespace backend.Services.Auth;

public static class AdminAuthorization
{
    public const string Policy = "AdminOnly";
    public const string Role = "Admin";
    public const string RoutePrefix = "api/admin";

    // Matches "api/admin" and everything below it, for templates with or without a leading slash.
    public static bool IsAdminTemplate(string? template)
    {
        var path = (template ?? string.Empty).TrimStart('~').TrimStart('/');

        return path.Equals(RoutePrefix, StringComparison.OrdinalIgnoreCase)
            || path.StartsWith(RoutePrefix + "/", StringComparison.OrdinalIgnoreCase);
    }
}

// Every action routed under /api/admin gets the AdminOnly policy as endpoint metadata, so a new
// admin controller is protected without remembering an attribute. UseAuthorization enforces it
// for every HTTP method before the controller runs: no/invalid/expired cookie -> 401,
// authenticated without the Admin role -> 403.
public sealed class AdminRouteAuthorizationConvention : IApplicationModelConvention
{
    public void Apply(ApplicationModel application)
    {
        foreach (var controller in application.Controllers)
        foreach (var action in controller.Actions)
        foreach (var selector in action.Selectors)
        {
            if (!Templates(controller, selector).Any(AdminAuthorization.IsAdminTemplate))
            {
                continue;
            }

            // An admin endpoint must never be made public by a stray attribute.
            if (
                controller.Attributes.OfType<IAllowAnonymous>().Any()
                || action.Attributes.OfType<IAllowAnonymous>().Any()
            )
            {
                throw new InvalidOperationException(
                    $"{controller.ControllerName}.{action.ActionName} is under /{AdminAuthorization.RoutePrefix} "
                        + "and must not allow anonymous access."
                );
            }

            selector.EndpointMetadata.Add(new AuthorizeAttribute(AdminAuthorization.Policy));
        }
    }

    private static IEnumerable<string> Templates(ControllerModel controller, SelectorModel selector)
    {
        var controllerRoutes = controller
            .Selectors.Select(x => x.AttributeRouteModel)
            .DefaultIfEmpty(null);

        foreach (var controllerRoute in controllerRoutes)
        {
            yield return AttributeRouteModel
                .CombineAttributeRouteModel(controllerRoute, selector.AttributeRouteModel)
                ?.Template
                ?? string.Empty;
        }
    }
}

// Fails startup if any routed /api/admin endpoint lacks the AdminOnly policy, whatever added it.
public static class AdminEndpointAudit
{
    public static void Verify(IEnumerable<Endpoint> endpoints)
    {
        var unprotected = endpoints
            .OfType<RouteEndpoint>()
            .Where(endpoint => AdminAuthorization.IsAdminTemplate(endpoint.RoutePattern.RawText))
            .Where(endpoint =>
                endpoint.Metadata.GetMetadata<IAllowAnonymous>() is not null
                || !endpoint
                    .Metadata.GetOrderedMetadata<IAuthorizeData>()
                    .Any(data => data.Policy == AdminAuthorization.Policy)
            )
            .Select(endpoint => endpoint.DisplayName ?? endpoint.RoutePattern.RawText)
            .ToList();

        if (unprotected.Count > 0)
        {
            throw new InvalidOperationException(
                "Admin endpoints without the AdminOnly policy: " + string.Join(", ", unprotected)
            );
        }
    }
}
