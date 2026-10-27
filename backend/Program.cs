using System.Threading.RateLimiting;
using backend.Data;
using backend.Data.Seeders;
using backend.Models;
using backend.Services.Admin;
using backend.Services.Auth;
using backend.Services.CompanyServices;
using backend.Services.ContactMessages;
using backend.Services.Media;
using backend.Services.Navigation;
using backend.Services.Projects;
using backend.Services.Sections;
using backend.Services.SiteSettings;
using backend.Services.SocialLinks;
using backend.Services.Themes;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers(options =>
{
    options.Conventions.Add(new AdminRouteAuthorizationConvention());
});
builder.Services.AddOpenApi();

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Database connection string is missing.");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySQL(connectionString);
});

builder.Services.AddScoped<ISectionService, SectionService>();
builder.Services.AddScoped<ISiteSettingsService, SiteSettingsService>();
builder.Services.AddScoped<IThemeService, ThemeService>();
builder.Services.AddScoped<ICompanyServiceManager, CompanyServiceManager>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IMediaService, MediaService>();
builder.Services.AddScoped<INavigationService, NavigationService>();
builder.Services.AddScoped<ISocialLinkService, SocialLinkService>();
builder.Services.AddScoped<IContactMessageService, ContactMessageService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddSingleton(TimeProvider.System);
builder.Services.AddSingleton<LoginAttemptTracker>();

builder.Services.AddScoped<IPasswordHasher<AdminUser>, PasswordHasher<AdminUser>>();

builder
    .Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "portfolio_admin";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        // Secure over HTTPS in development; always Secure elsewhere, even behind a TLS proxy.
        options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
            ? CookieSecurePolicy.SameAsRequest
            : CookieSecurePolicy.Always;

        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = false;

        options.LoginPath = "/api/auth/login";

        // A disabled or deleted administrator loses the session on the next request.
        options.Events.OnValidatePrincipal = AdminSessionValidator.ValidateAsync;

        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        };

        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = 403;
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(
        AdminAuthorization.Policy,
        policy => policy.RequireAuthenticatedUser().RequireRole(AdminAuthorization.Role)
    );
});

// Origins of the Next.js site. The same list limits CORS and cross-origin admin writes.
var allowedOrigins =
    builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:3000"];

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.AddPolicy(
        "ContactSubmission",
        httpContext =>
            RateLimitPartition.GetFixedWindowLimiter(
                httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 5,
                    Window = TimeSpan.FromMinutes(15),
                    QueueLimit = 0,
                }
            )
    );
});

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
        {
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
        }
    );
});

var app = builder.Build();

if (args.Contains("--seed-media"))
{
    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var environment = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();

    await MediaSeeder.SeedAsync(context, environment.ContentRootPath, environment.WebRootPath);

    Console.WriteLine("Media seeding completed.");
    return;
}

if (args.Contains("--seed-sections"))
{
    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await SectionSeeder.SeedAsync(context);

    Console.WriteLine("Section seeding completed.");
    return;
}

if (args.Contains("--seed-site-settings"))
{
    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await SiteSettingsSeeder.SeedAsync(context);

    Console.WriteLine("Site settings seeding completed.");
    return;
}

if (args.Contains("--seed-themes"))
{
    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await ThemeSeeder.SeedAsync(context);

    Console.WriteLine("Theme seeding completed.");
    return;
}

if (args.Contains("--seed-company-services"))
{
    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await CompanyServiceSeeder.SeedAsync(context);

    Console.WriteLine("Company services seeding completed.");
    return;
}

if (args.Contains("--seed-projects"))
{
    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await ProjectSeeder.SeedAsync(context);

    Console.WriteLine("Project seeding completed.");
    return;
}

if (args.Contains("--seed-navigation"))
{
    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await NavigationSeeder.SeedAsync(context);

    Console.WriteLine("Navigation seeding completed.");
    return;
}

if (args.Contains("--seed-social-links"))
{
    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await SocialLinkSeeder.SeedAsync(context);

    Console.WriteLine("Social links seeding completed.");
    return;
}

if (args.Contains("--seed-section-content"))
{
    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await SectionContentSeeder.SeedAsync(context);

    Console.WriteLine("Section content seeding completed.");
    return;
}

if (args.Contains("--seed-admin"))
{
    if (!app.Environment.IsDevelopment())
        throw new InvalidOperationException("Admin seeding is only allowed in Development.");

    var fullName = Environment.GetEnvironmentVariable("ADMIN_FULL_NAME");

    var email = Environment.GetEnvironmentVariable("ADMIN_EMAIL");

    var password = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");

    if (
        string.IsNullOrWhiteSpace(fullName)
        || string.IsNullOrWhiteSpace(email)
        || string.IsNullOrWhiteSpace(password)
        || password.Length < 12
    )
    {
        throw new InvalidOperationException(
            "Set ADMIN_FULL_NAME, ADMIN_EMAIL and ADMIN_PASSWORD. "
                + "The password must contain at least 12 characters."
        );
    }

    using var scope = app.Services.CreateScope();

    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await AdminSeeder.SeedAsync(db, fullName, email, password);

    return;
}
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseRateLimiter();

// Defence in depth against cross-site writes: a browser always sends Origin on POST, PUT,
// PATCH and DELETE, so one from an unknown site is refused. The Next.js server sends none.
app.UseWhen(
    context =>
        (
            HttpMethods.IsPost(context.Request.Method)
            || HttpMethods.IsPut(context.Request.Method)
            || HttpMethods.IsPatch(context.Request.Method)
            || HttpMethods.IsDelete(context.Request.Method)
        )
        && (
            context.Request.Path.StartsWithSegments("/api/admin")
            || context.Request.Path.StartsWithSegments("/api/auth")
        ),
    branch =>
        branch.Use(
            async (context, next) =>
            {
                var origin = context.Request.Headers.Origin.ToString();

                if (
                    origin.Length > 0
                    && !allowedOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase)
                )
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return;
                }

                await next();
            }
        )
);

app.UseAuthentication();
app.UseAuthorization();

app.UseStaticFiles();
app.MapControllers();

// Refuse to start if an /api/admin endpoint is missing the AdminOnly policy.
AdminEndpointAudit.Verify(
    ((IEndpointRouteBuilder)app).DataSources.SelectMany(source => source.Endpoints)
);

if (app.Environment.IsDevelopment())
{
    app.MapGet(
        "/dev/db-check",
        async (AppDbContext db) =>
        {
            var connected = await db.Database.CanConnectAsync();

            return connected
                ? Results.Ok(new { message = "MySQL connection successful" })
                : Results.Problem("Unable to connect to MySQL.");
        }
    );
}

app.Run();
