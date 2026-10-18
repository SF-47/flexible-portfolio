using System.Threading.RateLimiting;
using backend.Data;
using backend.Data.Seeders;
using backend.Services.Admin;
using backend.Services.CompanyServices;
using backend.Services.ContactMessages;
using backend.Services.Media;
using backend.Services.Navigation;
using backend.Services.Projects;
using backend.Services.Sections;
using backend.Services.SiteSettings;
using backend.Services.SocialLinks;
using backend.Services.Themes;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
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
            policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
        }
    );
});

var app = builder.Build();

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

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseRateLimiter();
app.UseAuthorization();
app.UseStaticFiles();
app.MapControllers();

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
