using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<SiteSettings> SiteSettings => Set<SiteSettings>();
    public DbSet<Theme> Themes => Set<Theme>();
    public DbSet<Section> Sections => Set<Section>();
    public DbSet<NavigationItem> NavigationItems => Set<NavigationItem>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<ProjectImage> ProjectImages => Set<ProjectImage>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<MediaAsset> MediaAssets => Set<MediaAsset>();
    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<SiteSettings>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.CompanyName).IsRequired().HasMaxLength(150);
            entity.Property(x => x.Tagline).HasMaxLength(255);
            entity.Property(x => x.Email).HasMaxLength(254);
            entity.Property(x => x.Phone).HasMaxLength(30);
            entity.Property(x => x.Address).HasMaxLength(300);
            entity.Property(x => x.SeoTitle).HasMaxLength(200);
            entity.Property(x => x.SeoDescription).HasMaxLength(500);

            entity.HasOne(x => x.LogoMedia)
                .WithMany()
                .HasForeignKey(x => x.LogoMediaId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.FaviconMedia)
                .WithMany()
                .HasForeignKey(x => x.FaviconMediaId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Theme>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);

            entity.Property(x => x.PrimaryColor).IsRequired().HasColumnType("char(7)");
            entity.Property(x => x.AccentColor).IsRequired().HasColumnType("char(7)");
            entity.Property(x => x.BackgroundColor).IsRequired().HasColumnType("char(7)");
            entity.Property(x => x.TextColor).IsRequired().HasColumnType("char(7)");
            entity.Property(x => x.OnPrimaryColor).IsRequired().HasColumnType("char(7)");
            entity.Property(x => x.OnAccentColor).IsRequired().HasColumnType("char(7)");

            entity.Property(x => x.HeadingFont).IsRequired().HasMaxLength(100);
            entity.Property(x => x.BodyFont).IsRequired().HasMaxLength(100);
            entity.Property(x => x.NavbarVariant).IsRequired().HasMaxLength(50);

            entity.Property(x => x.IsActive).IsRequired();
        });

        modelBuilder.Entity<Section>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Type).IsRequired().HasMaxLength(50);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.Property(x => x.Variant).HasMaxLength(50);
            entity.Property(x => x.NavLabel).HasMaxLength(100);

            entity.Property(x => x.ContentJson).IsRequired().HasColumnType("json");
            entity.Property(x => x.SettingsJson).IsRequired().HasColumnType("json");

            entity.Property(x => x.SchemaVersion).IsRequired();

            entity.HasIndex(x => x.SortOrder);
        });

        modelBuilder.Entity<NavigationItem>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Label).IsRequired().HasMaxLength(100);
            entity.Property(x => x.LinkType).IsRequired().HasMaxLength(30);
            entity.Property(x => x.Url).HasMaxLength(2048);

            entity.HasOne(x => x.Section)
                .WithMany(x => x.NavigationItems)
                .HasForeignKey(x => x.SectionId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(x => x.SortOrder);
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Title).IsRequired().HasMaxLength(200);
            entity.Property(x => x.Slug).IsRequired().HasMaxLength(220);
            entity.Property(x => x.Category).HasMaxLength(100);
            entity.Property(x => x.Location).HasMaxLength(200);

            entity.HasIndex(x => x.Slug).IsUnique();
            entity.HasIndex(x => x.SortOrder);

            entity.HasOne(x => x.FeaturedImage)
                .WithMany()
                .HasForeignKey(x => x.FeaturedImageId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(x => x.Images)
                .WithOne(x => x.Project)
                .HasForeignKey(x => x.ProjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProjectImage>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.ProjectId).IsRequired();
            entity.Property(x => x.MediaAssetId).IsRequired();
            entity.Property(x => x.Caption).HasMaxLength(255);

            entity.HasOne(x => x.MediaAsset)
                .WithMany(x => x.ProjectImages)
                .HasForeignKey(x => x.MediaAssetId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(x => new { x.ProjectId, x.MediaAssetId }).IsUnique();
        });

        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Title).IsRequired().HasMaxLength(150);
            entity.Property(x => x.Description).IsRequired();
            entity.Property(x => x.IconName).HasMaxLength(100);

            entity.HasOne(x => x.ImageMedia)
                .WithMany()
                .HasForeignKey(x => x.ImageMediaId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(x => x.SortOrder);
        });

        modelBuilder.Entity<MediaAsset>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.OriginalFileName).IsRequired().HasMaxLength(255);
            entity.Property(x => x.StorageKey).IsRequired().HasMaxLength(500);
            entity.Property(x => x.ContentType).IsRequired().HasMaxLength(100);
            entity.Property(x => x.FileSizeBytes).IsRequired();
            entity.Property(x => x.AltText).HasMaxLength(255);

            entity.HasIndex(x => x.StorageKey).IsUnique();
        });

        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.FullName).IsRequired().HasMaxLength(150);
            entity.Property(x => x.Email).IsRequired().HasMaxLength(254);
            entity.Property(x => x.PasswordHash).IsRequired().HasMaxLength(500);
            entity.Property(x => x.IsActive).IsRequired();

            entity.HasIndex(x => x.Email).IsUnique();
        });

        modelBuilder.Entity<ContactMessage>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Name).IsRequired().HasMaxLength(150);
            entity.Property(x => x.Email).IsRequired().HasMaxLength(254);
            entity.Property(x => x.Phone).HasMaxLength(30);
            entity.Property(x => x.Subject).HasMaxLength(200);
            entity.Property(x => x.Message).IsRequired();
            entity.Property(x => x.IsRead).IsRequired();

            entity.HasIndex(x => x.CreatedAt);
        });

        modelBuilder.Entity<SocialLink>(entity =>
        {
            entity.HasKey(x => x.Id);

            entity.Property(x => x.Platform).IsRequired().HasMaxLength(50);
            entity.Property(x => x.Url).IsRequired().HasMaxLength(2048);

            entity.HasIndex(x => x.SortOrder);
        });
    }
}
