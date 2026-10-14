using backend.Data;
using backend.Data.Seeders;
using backend.Services.Sections;
using backend.Services.SiteSettings;
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

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
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
