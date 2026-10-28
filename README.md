
```
flexible-portfolio
├─ PROJECT_STRUCTURE_AUDIT.md
├─ backend
│  ├─ Controllers
│  │  ├─ Admin
│  │  │  ├─ AdminCatalogController.cs
│  │  │  ├─ AdminContactMessagesController.cs
│  │  │  ├─ AdminController.cs
│  │  │  └─ AdminNavigationController.cs
│  │  ├─ AdminMediaController.cs
│  │  ├─ AdminThemesController.cs
│  │  ├─ AuthController.cs
│  │  ├─ CompanyServicesController.cs
│  │  ├─ ContactMessagesController.cs
│  │  ├─ MediaController.cs
│  │  ├─ NavigationController.cs
│  │  ├─ ProjectsController.cs
│  │  ├─ SectionsController.cs
│  │  ├─ SiteSettingsController.cs
│  │  ├─ SocialLinksController.cs
│  │  └─ ThemesController.cs
│  ├─ DTOs
│  │  ├─ Admin
│  │  │  └─ DashboardStatsResponse.cs
│  │  ├─ Auth
│  │  │  ├─ AdminProfileResponse.cs
│  │  │  └─ LoginRequest.cs
│  │  ├─ CompanyServices
│  │  │  ├─ AdminServiceDtos.cs
│  │  │  └─ CompanyServicesResponse.cs
│  │  ├─ ContactMessages
│  │  │  ├─ AdminContactMessageResponse.cs
│  │  │  ├─ ContactMessageResponse.cs
│  │  │  └─ CreateContactMessageRequest.cs
│  │  ├─ Media
│  │  │  ├─ AdminMediaDtos.cs
│  │  │  └─ MediaAssetResponse.cs
│  │  ├─ Navigation
│  │  │  ├─ AdminNavigationDtos.cs
│  │  │  └─ NavigationResponse.cs
│  │  ├─ Projects
│  │  │  ├─ AdminProjectDtos.cs
│  │  │  └─ ProjectResponse.cs
│  │  ├─ Sections
│  │  │  ├─ ReorderSectionsRequest.cs
│  │  │  ├─ SectionResponse.cs
│  │  │  ├─ UpdateSectionContentRequest.cs
│  │  │  └─ UpdateSectionsLayoutRequest.cs
│  │  ├─ SiteSettings
│  │  │  ├─ SiteSettingsResponse.cs
│  │  │  └─ UpdateBrandRequest.cs
│  │  ├─ SocialLinks
│  │  │  ├─ AdminSocialLinkDtos.cs
│  │  │  └─ SocialLinkResponse.cs
│  │  └─ Themes
│  │     ├─ ThemeResponse.cs
│  │     └─ UpdateThemeRequest.cs
│  ├─ Data
│  │  ├─ AppDbContext.cs
│  │  └─ Seeders
│  │     ├─ AdminSeeder.cs
│  │     ├─ CompanyServiceSeeder.cs
│  │     ├─ MediaSeeder.cs
│  │     ├─ NavigationSeeder.cs
│  │     ├─ ProjectSeeder.cs
│  │     ├─ SectionContentSeeder.cs
│  │     ├─ SectionSeeder.cs
│  │     ├─ SiteSettingsSeeder.cs
│  │     ├─ SocialLinkSeeder.cs
│  │     └─ ThemeSeeder.cs
│  ├─ Migrations
│  │  ├─ 20261012135403_InitialCreate.Designer.cs
│  │  ├─ 20261012135403_InitialCreate.cs
│  │  ├─ 20261015090822_RemoveProjectImages.Designer.cs
│  │  ├─ 20261015090822_RemoveProjectImages.cs
│  │  ├─ 20261018190155_AddThemeIsCustom.Designer.cs
│  │  ├─ 20261018190155_AddThemeIsCustom.cs
│  │  ├─ 20261023172507_RestrictNavigationSectionDelete.Designer.cs
│  │  ├─ 20261023172507_RestrictNavigationSectionDelete.cs
│  │  └─ AppDbContextModelSnapshot.cs
│  ├─ Models
│  │  ├─ AdminUser.cs
│  │  ├─ ContactMessage.cs
│  │  ├─ MediaAsset.cs
│  │  ├─ NavigationItem.cs
│  │  ├─ Project.cs
│  │  ├─ Section.cs
│  │  ├─ Service.cs
│  │  ├─ SiteSettings.cs
│  │  ├─ SocialLink.cs
│  │  └─ Theme.cs
│  ├─ Portfolio.Api.csproj
│  ├─ Program.cs
│  ├─ Properties
│  │  └─ launchSettings.json
│  ├─ SeedData
│  │  └─ images
│  │     ├─ about.jpg
│  │     ├─ project-1.jpg
│  │     ├─ project-2.jpg
│  │     ├─ project-3.jpg
│  │     ├─ project-4.jpg
│  │     └─ project-5.jpg
│  ├─ Services
│  │  ├─ Admin
│  │  │  ├─ DashboardService.cs
│  │  │  └─ IDashboardService.cs
│  │  ├─ Auth
│  │  │  ├─ AdminAuthorization.cs
│  │  │  ├─ AdminSessionValidator.cs
│  │  │  ├─ AuthService.cs
│  │  │  ├─ IAuthService.cs
│  │  │  └─ LoginAttemptTracker.cs
│  │  ├─ Common
│  │  │  ├─ ConflictException.cs
│  │  │  ├─ HttpUrl.cs
│  │  │  └─ Timestamps.cs
│  │  ├─ CompanyServices
│  │  │  ├─ CompanyServiceService.cs
│  │  │  └─ ICompanyServiceService.cs
│  │  ├─ ContactMessages
│  │  │  ├─ ContactMessageService.cs
│  │  │  └─ IContactMessageService.cs
│  │  ├─ Media
│  │  │  ├─ IMediaService.cs
│  │  │  └─ MediaService.cs
│  │  ├─ Navigation
│  │  │  ├─ INavigationService.cs
│  │  │  └─ NavigationService.cs
│  │  ├─ Projects
│  │  │  ├─ IProjectService.cs
│  │  │  └─ ProjectService.cs
│  │  ├─ Sections
│  │  │  ├─ ISectionService.cs
│  │  │  ├─ SectionContentValidator.cs
│  │  │  └─ SectionService.cs
│  │  ├─ SiteSettings
│  │  │  ├─ ISiteSettingsService.cs
│  │  │  └─ SiteSettingsService.cs
│  │  ├─ SocialLinks
│  │  │  ├─ ISocialLinkService.cs
│  │  │  └─ SocialLinkService.cs
│  │  └─ Themes
│  │     ├─ IThemeService.cs
│  │     └─ ThemeService.cs
│  ├─ appsettings.Development.json
│  ├─ appsettings.json
│  ├─ bin
│  │  └─ Debug
│  │     └─ net10.0
│  │        ├─ BouncyCastle.Cryptography.dll
│  │        ├─ BuildHost-net472
│  │        │  ├─ Microsoft.Build.Locator.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.exe
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.exe.config
│  │        │  ├─ Microsoft.IO.Redist.dll
│  │        │  ├─ Newtonsoft.Json.dll
│  │        │  ├─ System.Buffers.dll
│  │        │  ├─ System.Collections.Immutable.dll
│  │        │  ├─ System.CommandLine.dll
│  │        │  ├─ System.Memory.dll
│  │        │  ├─ System.Numerics.Vectors.dll
│  │        │  ├─ System.Runtime.CompilerServices.Unsafe.dll
│  │        │  ├─ System.Threading.Tasks.Extensions.dll
│  │        │  ├─ cs
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ de
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ es
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ fr
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ it
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ ja
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ ko
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ pl
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ pt-BR
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ ru
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ tr
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ zh-Hans
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  └─ zh-Hant
│  │        │     └─ System.CommandLine.resources.dll
│  │        ├─ BuildHost-netcore
│  │        │  ├─ Microsoft.Build.Locator.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.deps.json
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.BuildHost.runtimeconfig.json
│  │        │  ├─ Newtonsoft.Json.dll
│  │        │  ├─ System.Collections.Immutable.dll
│  │        │  ├─ System.CommandLine.dll
│  │        │  ├─ cs
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ de
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ es
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ fr
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ it
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ ja
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ ko
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ pl
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ pt-BR
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ ru
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ tr
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  ├─ zh-Hans
│  │        │  │  └─ System.CommandLine.resources.dll
│  │        │  └─ zh-Hant
│  │        │     └─ System.CommandLine.resources.dll
│  │        ├─ Google.Protobuf.dll
│  │        ├─ Humanizer.dll
│  │        ├─ K4os.Compression.LZ4.Streams.dll
│  │        ├─ K4os.Compression.LZ4.dll
│  │        ├─ K4os.Hash.xxHash.dll
│  │        ├─ Microsoft.AspNetCore.OpenApi.dll
│  │        ├─ Microsoft.Build.Framework.dll
│  │        ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.dll
│  │        ├─ Microsoft.CodeAnalysis.CSharp.dll
│  │        ├─ Microsoft.CodeAnalysis.ExternalAccess.RazorCompiler.dll
│  │        ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.dll
│  │        ├─ Microsoft.CodeAnalysis.Workspaces.dll
│  │        ├─ Microsoft.CodeAnalysis.dll
│  │        ├─ Microsoft.EntityFrameworkCore.Abstractions.dll
│  │        ├─ Microsoft.EntityFrameworkCore.Design.dll
│  │        ├─ Microsoft.EntityFrameworkCore.Relational.dll
│  │        ├─ Microsoft.EntityFrameworkCore.dll
│  │        ├─ Microsoft.Extensions.DependencyModel.dll
│  │        ├─ Microsoft.OpenApi.dll
│  │        ├─ Microsoft.VisualStudio.SolutionPersistence.dll
│  │        ├─ Mono.TextTemplating.dll
│  │        ├─ MySql.Data.dll
│  │        ├─ MySql.EntityFrameworkCore.dll
│  │        ├─ Newtonsoft.Json.dll
│  │        ├─ Portfolio.Api
│  │        ├─ Portfolio.Api.deps.json
│  │        ├─ Portfolio.Api.dll
│  │        ├─ Portfolio.Api.pdb
│  │        ├─ Portfolio.Api.runtimeconfig.json
│  │        ├─ Portfolio.Api.staticwebassets.endpoints.json
│  │        ├─ Portfolio.Api.staticwebassets.runtime.json
│  │        ├─ System.CodeDom.dll
│  │        ├─ System.Composition.AttributedModel.dll
│  │        ├─ System.Composition.Convention.dll
│  │        ├─ System.Composition.Hosting.dll
│  │        ├─ System.Composition.Runtime.dll
│  │        ├─ System.Composition.TypedParts.dll
│  │        ├─ System.Configuration.ConfigurationManager.dll
│  │        ├─ System.Security.Cryptography.ProtectedData.dll
│  │        ├─ System.Security.Permissions.dll
│  │        ├─ System.Windows.Extensions.dll
│  │        ├─ ZstdSharp.dll
│  │        ├─ appsettings.Development.json
│  │        ├─ appsettings.json
│  │        ├─ cs
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │        │  └─ Microsoft.CodeAnalysis.resources.dll
│  │        ├─ de
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │        │  └─ Microsoft.CodeAnalysis.resources.dll
│  │        ├─ dotnet-tools.json
│  │        ├─ es
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │        │  └─ Microsoft.CodeAnalysis.resources.dll
│  │        ├─ fr
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │        │  └─ Microsoft.CodeAnalysis.resources.dll
│  │        ├─ it
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │        │  └─ Microsoft.CodeAnalysis.resources.dll
│  │        ├─ ja
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │        │  └─ Microsoft.CodeAnalysis.resources.dll
│  │        ├─ ko
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │        │  └─ Microsoft.CodeAnalysis.resources.dll
│  │        ├─ pl
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │        │  └─ Microsoft.CodeAnalysis.resources.dll
│  │        ├─ pt-BR
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │        │  └─ Microsoft.CodeAnalysis.resources.dll
│  │        ├─ ru
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │        │  └─ Microsoft.CodeAnalysis.resources.dll
│  │        ├─ runtimes
│  │        │  ├─ win
│  │        │  │  └─ lib
│  │        │  │     └─ net10.0
│  │        │  │        └─ System.Windows.Extensions.dll
│  │        │  └─ win-x64
│  │        │     └─ native
│  │        │        ├─ comerr64.dll
│  │        │        ├─ gssapi64.dll
│  │        │        ├─ k5sprt64.dll
│  │        │        ├─ krb5_64.dll
│  │        │        └─ krbcc64.dll
│  │        ├─ tr
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │        │  └─ Microsoft.CodeAnalysis.resources.dll
│  │        ├─ zh-Hans
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │        │  ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │        │  └─ Microsoft.CodeAnalysis.resources.dll
│  │        └─ zh-Hant
│  │           ├─ Microsoft.CodeAnalysis.CSharp.Workspaces.resources.dll
│  │           ├─ Microsoft.CodeAnalysis.CSharp.resources.dll
│  │           ├─ Microsoft.CodeAnalysis.Workspaces.MSBuild.resources.dll
│  │           ├─ Microsoft.CodeAnalysis.Workspaces.resources.dll
│  │           └─ Microsoft.CodeAnalysis.resources.dll
│  ├─ dotnet-tools.json
│  ├─ obj
│  │  ├─ Debug
│  │  │  └─ net10.0
│  │  │     ├─ .NETCoreApp,Version=v10.0.AssemblyAttributes.cs
│  │  │     ├─ Portfoli.7273ABDC.Up2Date
│  │  │     ├─ Portfolio.Api.AssemblyInfo.cs
│  │  │     ├─ Portfolio.Api.AssemblyInfoInputs.cache
│  │  │     ├─ Portfolio.Api.GeneratedMSBuildEditorConfig.editorconfig
│  │  │     ├─ Portfolio.Api.GlobalUsings.g.cs
│  │  │     ├─ Portfolio.Api.MvcApplicationPartsAssemblyInfo.cache
│  │  │     ├─ Portfolio.Api.MvcApplicationPartsAssemblyInfo.cs
│  │  │     ├─ Portfolio.Api.assets.cache
│  │  │     ├─ Portfolio.Api.csproj.AssemblyReference.cache
│  │  │     ├─ Portfolio.Api.csproj.CoreCompileInputs.cache
│  │  │     ├─ Portfolio.Api.csproj.FileListAbsolute.txt
│  │  │     ├─ Portfolio.Api.dll
│  │  │     ├─ Portfolio.Api.genruntimeconfig.cache
│  │  │     ├─ Portfolio.Api.pdb
│  │  │     ├─ Portfolio.Api.sourcelink.json
│  │  │     ├─ apphost
│  │  │     ├─ ref
│  │  │     │  └─ Portfolio.Api.dll
│  │  │     ├─ refint
│  │  │     │  └─ Portfolio.Api.dll
│  │  │     ├─ rjimswa.dswa.cache.json
│  │  │     ├─ rjsmcshtml.dswa.cache.json
│  │  │     ├─ rjsmrazor.dswa.cache.json
│  │  │     ├─ rpswa.dswa.cache.json
│  │  │     ├─ staticwebassets
│  │  │     ├─ staticwebassets.build.endpoints.json
│  │  │     ├─ staticwebassets.build.json
│  │  │     ├─ staticwebassets.build.json.cache
│  │  │     ├─ staticwebassets.development.json
│  │  │     └─ swae.build.ex.cache
│  │  ├─ Portfolio.Api.csproj.nuget.dgspec.json
│  │  ├─ Portfolio.Api.csproj.nuget.g.props
│  │  ├─ Portfolio.Api.csproj.nuget.g.targets
│  │  ├─ project.assets.json
│  │  └─ project.nuget.cache
│  └─ wwwroot
│     └─ uploads
│        ├─ hero-construction.jpg
│        ├─ images.jpg
│        ├─ seed-about.jpg
│        ├─ seed-project-1.jpg
│        ├─ seed-project-2.jpg
│        ├─ seed-project-3.jpg
│        ├─ seed-project-4.jpg
│        └─ seed-project-5.jpg
└─ frontend
   ├─ .next
   │  └─ dev
   │     ├─ build
   │     │  ├─ chunks
   │     │  │  ├─ [root-of-the-server]__0dhog6e7wofbn._.js
   │     │  │  ├─ [root-of-the-server]__0dhog6e7wofbn._.js.map
   │     │  │  ├─ [root-of-the-server]__1nvwxt65m8t91._.js
   │     │  │  ├─ [root-of-the-server]__1nvwxt65m8t91._.js.map
   │     │  │  ├─ [turbopack-node]_transforms_webpack-loaders_ts_1nw9y6mi1x-xw._.js
   │     │  │  ├─ [turbopack-node]_transforms_webpack-loaders_ts_1nw9y6mi1x-xw._.js.map
   │     │  │  ├─ [turbopack]_runtime.js
   │     │  │  ├─ [turbopack]_runtime.js.map
   │     │  │  ├─ pool_entry-[turbopack-node]_transforms_webpack-loaders_ts_21971j8nic2qx._.js
   │     │  │  └─ pool_entry-[turbopack-node]_transforms_webpack-loaders_ts_21971j8nic2qx._.js.map
   │     │  └─ package.json
   │     ├─ build-manifest.json
   │     ├─ cache
   │     │  ├─ .rscinfo
   │     │  ├─ images
   │     │  │  ├─ -9gF_rwlOJgRGfjWYz0ahhQqDRbWI898Kry1TQDF6YY
   │     │  │  │  └─ 14400.1793051646079.lwXTex8gGkGTbCgMUU6CVr9fq7o63XzzZO_GBeWy9v8.IjFkZDYwNzEyYjk3NjFjMSI.webp
   │     │  │  ├─ -NMu2cVjrBX2_Lfqxjx6hfCA3l0NQvwPel-NK5ObOGA
   │     │  │  │  └─ 14400.1793152425626.yoMS8yjXt4Kdk7CzujysnzJVRnvZ4RfkoD-v_QpVCDM.IjFkZDY0YTI1ZDEzYTViMyI.webp
   │     │  │  ├─ FRhZ15nzy0bjYXlRG9zoP2GQEafTRz-sBAO7-vF4xIo
   │     │  │  │  └─ 14400.1793152396357.mBKcqXpFMh9XARLraUG_gNtXuxX9KHN0_jKhKHnUcA4.IjFkZDY0YTI1ZDEzOTZlMyI.webp
   │     │  │  ├─ Ha3C2_7XRnqJj8c1th_6tlUK0tbnrhhvuL3wBg-8WcY
   │     │  │  │  └─ 14400.1793152396366.MT35ZOpE7B43Oxdk5Sno7axTbMhPnCp2WCz9UU6czTc.IjFkZDY0YTI1ZDExMGViMSI.webp
   │     │  │  ├─ Is1A7H3hN8PnMTh60GuBl7oKpELIObB5AU06ErIUoC4
   │     │  │  │  └─ 14400.1793152396363.GnmyfB_6B47hjdbqk_ZKSOwaXrmYdO6t8fQeRAP4cpw.IjFkZDY0YTI1ZDEzOWRjZSI.webp
   │     │  │  ├─ LbEPUov-81wsTC-WZsqXIUNKGtqEG58fow7PTEr9CdQ
   │     │  │  │  └─ 14400.1793152396353.iCAs-JqnpfK0_35e2U74vVWQOe2TUf-c3eaKs8Ih4Kw.Vy8iYzRiYi0xYTEyNmQ4ZTZlNCI.webp
   │     │  │  ├─ NM9R6ywvwYWJWcok1gH1xLwM3AFna-_mVyHG7fE2JBc
   │     │  │  │  └─ 14400.1793152425630.1VumfXloslBh0n5Q4sM1iVYdZVqQXAyoLeW8QXU13UI.IjFkZDYwNzEyYjk3NjFjMSI.webp
   │     │  │  ├─ QMuQuSjRRyLGJm1sn5I6QcKbY_u3xDzYLH01NTQz32E
   │     │  │  │  └─ 14400.1793152396359.XLIiPeihs6GnakHPNGhfdHy54y0GflavMwWvjeC-3fI.IjFkZDY0YTI1ZDEzZThiYiI.webp
   │     │  │  ├─ Qls9k70URJ6og0PMR5z-yDIF9TRy8s6YZ__KLDl2fds
   │     │  │  │  └─ 14400.1793152396364.GuhdWYV5fICxAh97AOJXxmDnF4NECpHXjRhAOOMxJe8.IjFkZDY0YTI1ZDEzYmFmNiI.webp
   │     │  │  ├─ aRu4dWMuJzAPAz7tssme5bkJs1bhT6g2keQ104IceZo
   │     │  │  │  └─ 14400.1793152396369.d-Vx_YmBgtuHGM96FQXgYfwSHJMMOgLx9ZonueocqKQ.IjFkZDYwNzEyYjk3NjFjMSI.webp
   │     │  │  ├─ d1nvMypqweCGDqJkU_qOHcvNZkOqyFqR65VaKuSPxcI
   │     │  │  │  └─ 14400.1793152396361.wAkD_7A4ShV8y_UFJcPizcBlcrUNueYESTr6qH9Nkv8.IjFkZDY0YTI1ZDEzYTViMyI.webp
   │     │  │  ├─ kUh4xWbWqs3ejLufRaqVHxcc18P9xCR_Zbo7Ox_Ckg8
   │     │  │  │  └─ 14400.1793152396362.iCAs-JqnpfK0_35e2U74vVWQOe2TUf-c3eaKs8Ih4Kw.IjFkZDY0YTI1ZDEzZThiYiI.webp
   │     │  │  └─ lrbHScNdXvuafDoacb4Er0nP-EdgeM9z0owkr4u5_y0
   │     │  │     └─ 14400.1793051625356.wxJ7HMJR0KK5yVUiPtP_ES6AJt7f-tYD_9SfKhsnkGQ.IjFkZDYwNzEyYjk3NjFjMSI.webp
   │     │  ├─ next-devtools-config.json
   │     │  └─ turbopack
   │     │     └─ v16.4.3-29bbeab0
   │     │        ├─ 00000049.sst
   │     │        ├─ 00000050.sst
   │     │        ├─ 00000053.meta
   │     │        ├─ 00000126.sst
   │     │        ├─ 00000127.sst
   │     │        ├─ 00000128.sst
   │     │        ├─ 00000129.meta
   │     │        ├─ 00000130.sst
   │     │        ├─ 00000131.sst
   │     │        ├─ 00000132.meta
   │     │        ├─ 00000133.sst
   │     │        ├─ 00000134.meta
   │     │        ├─ 00000136.sst
   │     │        ├─ 00000137.sst
   │     │        ├─ 00000138.sst
   │     │        ├─ 00000141.meta
   │     │        ├─ 00000142.meta
   │     │        ├─ 00000143.meta
   │     │        ├─ 00000144.sst
   │     │        ├─ 00000145.sst
   │     │        ├─ 00000146.sst
   │     │        ├─ 00000149.meta
   │     │        ├─ 00000150.meta
   │     │        ├─ 00000151.meta
   │     │        ├─ 00000152.sst
   │     │        ├─ 00000153.sst
   │     │        ├─ 00000154.sst
   │     │        ├─ 00000157.meta
   │     │        ├─ 00000158.meta
   │     │        ├─ 00000159.meta
   │     │        ├─ 00000160.sst
   │     │        ├─ 00000161.sst
   │     │        ├─ 00000164.meta
   │     │        ├─ 00000165.meta
   │     │        ├─ 00000166.sst
   │     │        ├─ 00000167.meta
   │     │        ├─ 00000169.sst
   │     │        ├─ 00000170.sst
   │     │        ├─ 00000171.sst
   │     │        ├─ 00000172.sst
   │     │        ├─ 00000173.meta
   │     │        ├─ 00000174.meta
   │     │        ├─ 00000175.meta
   │     │        ├─ 00000176.meta
   │     │        ├─ 00000177.sst
   │     │        ├─ 00000178.sst
   │     │        ├─ 00000179.sst
   │     │        ├─ 00000180.sst
   │     │        ├─ 00000181.meta
   │     │        ├─ 00000182.meta
   │     │        ├─ 00000183.meta
   │     │        ├─ 00000184.meta
   │     │        ├─ CURRENT
   │     │        └─ LOG
   │     ├─ fallback-build-manifest.json
   │     ├─ lock
   │     ├─ logs
   │     │  └─ next-development.log
   │     ├─ package.json
   │     ├─ prerender-manifest.json
   │     ├─ routes-manifest.json
   │     ├─ server
   │     │  ├─ app
   │     │  │  ├─ admin
   │     │  │  │  ├─ (Dashboard)
   │     │  │  │  │  ├─ appearance
   │     │  │  │  │  │  ├─ page
   │     │  │  │  │  │  │  ├─ app-paths-manifest.json
   │     │  │  │  │  │  │  ├─ build-manifest.json
   │     │  │  │  │  │  │  ├─ client-components-ssr.js
   │     │  │  │  │  │  │  ├─ next-font-manifest.json
   │     │  │  │  │  │  │  ├─ react-loadable-manifest.json
   │     │  │  │  │  │  │  └─ server-reference-manifest.json
   │     │  │  │  │  │  ├─ page.js
   │     │  │  │  │  │  ├─ page.js.map
   │     │  │  │  │  │  └─ page_client-reference-manifest.js
   │     │  │  │  │  ├─ content
   │     │  │  │  │  │  ├─ page
   │     │  │  │  │  │  │  ├─ app-paths-manifest.json
   │     │  │  │  │  │  │  ├─ build-manifest.json
   │     │  │  │  │  │  │  ├─ client-components-ssr.js
   │     │  │  │  │  │  │  ├─ next-font-manifest.json
   │     │  │  │  │  │  │  ├─ react-loadable-manifest.json
   │     │  │  │  │  │  │  └─ server-reference-manifest.json
   │     │  │  │  │  │  ├─ page.js
   │     │  │  │  │  │  ├─ page.js.map
   │     │  │  │  │  │  └─ page_client-reference-manifest.js
   │     │  │  │  │  ├─ media
   │     │  │  │  │  │  ├─ page
   │     │  │  │  │  │  │  ├─ app-paths-manifest.json
   │     │  │  │  │  │  │  ├─ build-manifest.json
   │     │  │  │  │  │  │  ├─ client-components-ssr.js
   │     │  │  │  │  │  │  ├─ next-font-manifest.json
   │     │  │  │  │  │  │  ├─ react-loadable-manifest.json
   │     │  │  │  │  │  │  └─ server-reference-manifest.json
   │     │  │  │  │  │  ├─ page.js
   │     │  │  │  │  │  ├─ page.js.map
   │     │  │  │  │  │  └─ page_client-reference-manifest.js
   │     │  │  │  │  ├─ messages
   │     │  │  │  │  │  ├─ page
   │     │  │  │  │  │  │  ├─ app-paths-manifest.json
   │     │  │  │  │  │  │  ├─ build-manifest.json
   │     │  │  │  │  │  │  ├─ client-components-ssr.js
   │     │  │  │  │  │  │  ├─ next-font-manifest.json
   │     │  │  │  │  │  │  ├─ react-loadable-manifest.json
   │     │  │  │  │  │  │  └─ server-reference-manifest.json
   │     │  │  │  │  │  ├─ page.js
   │     │  │  │  │  │  ├─ page.js.map
   │     │  │  │  │  │  └─ page_client-reference-manifest.js
   │     │  │  │  │  ├─ navigation
   │     │  │  │  │  │  ├─ page
   │     │  │  │  │  │  │  ├─ app-paths-manifest.json
   │     │  │  │  │  │  │  ├─ build-manifest.json
   │     │  │  │  │  │  │  ├─ client-components-ssr.js
   │     │  │  │  │  │  │  ├─ next-font-manifest.json
   │     │  │  │  │  │  │  ├─ react-loadable-manifest.json
   │     │  │  │  │  │  │  └─ server-reference-manifest.json
   │     │  │  │  │  │  ├─ page.js
   │     │  │  │  │  │  ├─ page.js.map
   │     │  │  │  │  │  └─ page_client-reference-manifest.js
   │     │  │  │  │  ├─ page
   │     │  │  │  │  │  ├─ app-paths-manifest.json
   │     │  │  │  │  │  ├─ build-manifest.json
   │     │  │  │  │  │  ├─ client-components-ssr.js
   │     │  │  │  │  │  ├─ next-font-manifest.json
   │     │  │  │  │  │  ├─ react-loadable-manifest.json
   │     │  │  │  │  │  └─ server-reference-manifest.json
   │     │  │  │  │  ├─ page.js
   │     │  │  │  │  ├─ page.js.map
   │     │  │  │  │  ├─ page_client-reference-manifest.js
   │     │  │  │  │  └─ sections
   │     │  │  │  │     ├─ page
   │     │  │  │  │     │  ├─ app-paths-manifest.json
   │     │  │  │  │     │  ├─ build-manifest.json
   │     │  │  │  │     │  ├─ client-components-ssr.js
   │     │  │  │  │     │  ├─ next-font-manifest.json
   │     │  │  │  │     │  ├─ react-loadable-manifest.json
   │     │  │  │  │     │  └─ server-reference-manifest.json
   │     │  │  │  │     ├─ page.js
   │     │  │  │  │     ├─ page.js.map
   │     │  │  │  │     └─ page_client-reference-manifest.js
   │     │  │  │  ├─ login
   │     │  │  │  │  ├─ page
   │     │  │  │  │  │  ├─ app-paths-manifest.json
   │     │  │  │  │  │  ├─ build-manifest.json
   │     │  │  │  │  │  ├─ client-components-ssr.js
   │     │  │  │  │  │  ├─ next-font-manifest.json
   │     │  │  │  │  │  ├─ react-loadable-manifest.json
   │     │  │  │  │  │  └─ server-reference-manifest.json
   │     │  │  │  │  ├─ page.js
   │     │  │  │  │  ├─ page.js.map
   │     │  │  │  │  └─ page_client-reference-manifest.js
   │     │  │  │  └─ preview
   │     │  │  │     ├─ page
   │     │  │  │     │  ├─ app-paths-manifest.json
   │     │  │  │     │  ├─ build-manifest.json
   │     │  │  │     │  ├─ client-components-ssr.js
   │     │  │  │     │  ├─ next-font-manifest.json
   │     │  │  │     │  ├─ react-loadable-manifest.json
   │     │  │  │     │  └─ server-reference-manifest.json
   │     │  │  │     ├─ page.js
   │     │  │  │     ├─ page.js.map
   │     │  │  │     └─ page_client-reference-manifest.js
   │     │  │  ├─ api
   │     │  │  │  ├─ admin
   │     │  │  │  │  └─ projects
   │     │  │  │  │     ├─ route
   │     │  │  │  │     │  ├─ app-paths-manifest.json
   │     │  │  │  │     │  ├─ build-manifest.json
   │     │  │  │  │     │  └─ server-reference-manifest.json
   │     │  │  │  │     ├─ route.js
   │     │  │  │  │     ├─ route.js.map
   │     │  │  │  │     └─ route_client-reference-manifest.js
   │     │  │  │  └─ auth
   │     │  │  │     ├─ login
   │     │  │  │     │  ├─ route
   │     │  │  │     │  │  ├─ app-paths-manifest.json
   │     │  │  │     │  │  ├─ build-manifest.json
   │     │  │  │     │  │  └─ server-reference-manifest.json
   │     │  │  │     │  ├─ route.js
   │     │  │  │     │  ├─ route.js.map
   │     │  │  │     │  └─ route_client-reference-manifest.js
   │     │  │  │     └─ logout
   │     │  │  │        ├─ route
   │     │  │  │        │  ├─ app-paths-manifest.json
   │     │  │  │        │  ├─ build-manifest.json
   │     │  │  │        │  └─ server-reference-manifest.json
   │     │  │  │        ├─ route.js
   │     │  │  │        ├─ route.js.map
   │     │  │  │        └─ route_client-reference-manifest.js
   │     │  │  ├─ page
   │     │  │  │  ├─ app-paths-manifest.json
   │     │  │  │  ├─ build-manifest.json
   │     │  │  │  ├─ client-components-ssr.js
   │     │  │  │  ├─ next-font-manifest.json
   │     │  │  │  ├─ react-loadable-manifest.json
   │     │  │  │  └─ server-reference-manifest.json
   │     │  │  ├─ page.js
   │     │  │  ├─ page.js.map
   │     │  │  └─ page_client-reference-manifest.js
   │     │  ├─ app-paths-manifest.json
   │     │  ├─ chunks
   │     │  │  ├─ [root-of-the-server]__03rzpv6494f1-._.js
   │     │  │  ├─ [root-of-the-server]__03rzpv6494f1-._.js.map
   │     │  │  ├─ [root-of-the-server]__09jghwc1pahc4._.js
   │     │  │  ├─ [root-of-the-server]__09jghwc1pahc4._.js.map
   │     │  │  ├─ [root-of-the-server]__0eu-ly0xjx3lr._.js
   │     │  │  ├─ [root-of-the-server]__0eu-ly0xjx3lr._.js.map
   │     │  │  ├─ [root-of-the-server]__198ax930yj8pk._.js
   │     │  │  ├─ [root-of-the-server]__198ax930yj8pk._.js.map
   │     │  │  ├─ [turbopack]_runtime.js
   │     │  │  ├─ [turbopack]_runtime.js.map
   │     │  │  ├─ _next-internal_server_app_api_admin_projects_route_actions_0pld1xz645na5.js
   │     │  │  ├─ _next-internal_server_app_api_admin_projects_route_actions_0pld1xz645na5.js.map
   │     │  │  ├─ _next-internal_server_app_api_auth_login_route_actions_1ox7zi0683rx3.js
   │     │  │  ├─ _next-internal_server_app_api_auth_login_route_actions_1ox7zi0683rx3.js.map
   │     │  │  ├─ _next-internal_server_app_api_auth_logout_route_actions_0regwyrnie28t.js
   │     │  │  ├─ _next-internal_server_app_api_auth_logout_route_actions_0regwyrnie28t.js.map
   │     │  │  └─ ssr
   │     │  │     ├─ 1oeh_server_app_admin_(Dashboard)_navigation_page_actions_0jpn-gxqu-d9d.js
   │     │  │     ├─ 1oeh_server_app_admin_(Dashboard)_navigation_page_actions_0jpn-gxqu-d9d.js.map
   │     │  │     ├─ [externals]__1422pp8atd_1r._.js
   │     │  │     ├─ [externals]__1422pp8atd_1r._.js.map
   │     │  │     ├─ [externals]_next_dist_1e1zfvsur5d9m._.js
   │     │  │     ├─ [externals]_next_dist_1e1zfvsur5d9m._.js.map
   │     │  │     ├─ [root-of-the-server]__03t37_xsqx-p1._.js
   │     │  │     ├─ [root-of-the-server]__03t37_xsqx-p1._.js.map
   │     │  │     ├─ [root-of-the-server]__04p_esho7j59w._.js
   │     │  │     ├─ [root-of-the-server]__04p_esho7j59w._.js.map
   │     │  │     ├─ [root-of-the-server]__09bpzndmpgcth._.js
   │     │  │     ├─ [root-of-the-server]__09bpzndmpgcth._.js.map
   │     │  │     ├─ [root-of-the-server]__09gp5cy74rwno._.js
   │     │  │     ├─ [root-of-the-server]__09gp5cy74rwno._.js.map
   │     │  │     ├─ [root-of-the-server]__0_wsaq9c3qcny._.js
   │     │  │     ├─ [root-of-the-server]__0_wsaq9c3qcny._.js.map
   │     │  │     ├─ [root-of-the-server]__0bvut68ed9gr9._.js
   │     │  │     ├─ [root-of-the-server]__0bvut68ed9gr9._.js.map
   │     │  │     ├─ [root-of-the-server]__0nnpwnokafwf-._.js
   │     │  │     ├─ [root-of-the-server]__0nnpwnokafwf-._.js.map
   │     │  │     ├─ [root-of-the-server]__0u5shx74i58nv._.js
   │     │  │     ├─ [root-of-the-server]__0u5shx74i58nv._.js.map
   │     │  │     ├─ [root-of-the-server]__0umnz6zw9c59t._.js
   │     │  │     ├─ [root-of-the-server]__0umnz6zw9c59t._.js.map
   │     │  │     ├─ [root-of-the-server]__1-5oz77bjnns6._.js
   │     │  │     ├─ [root-of-the-server]__1-5oz77bjnns6._.js.map
   │     │  │     ├─ [root-of-the-server]__1assbsn-crjoq._.js
   │     │  │     ├─ [root-of-the-server]__1assbsn-crjoq._.js.map
   │     │  │     ├─ [root-of-the-server]__1hone4q9subm0._.js
   │     │  │     ├─ [root-of-the-server]__1hone4q9subm0._.js.map
   │     │  │     ├─ [root-of-the-server]__1jdvyl3sc7-zk._.js
   │     │  │     ├─ [root-of-the-server]__1jdvyl3sc7-zk._.js.map
   │     │  │     ├─ [root-of-the-server]__1le6hg-86deqx._.js
   │     │  │     ├─ [root-of-the-server]__1le6hg-86deqx._.js.map
   │     │  │     ├─ [root-of-the-server]__1o222bnka__jd._.js
   │     │  │     ├─ [root-of-the-server]__1o222bnka__jd._.js.map
   │     │  │     ├─ [root-of-the-server]__1q6khofmbkmp6._.js
   │     │  │     ├─ [root-of-the-server]__1q6khofmbkmp6._.js.map
   │     │  │     ├─ [root-of-the-server]__1r4re1k3d8stq._.js
   │     │  │     ├─ [root-of-the-server]__1r4re1k3d8stq._.js.map
   │     │  │     ├─ [root-of-the-server]__1uz94voxuxkeh._.js
   │     │  │     ├─ [root-of-the-server]__1uz94voxuxkeh._.js.map
   │     │  │     ├─ [root-of-the-server]__1xdv0swlxhywn._.js
   │     │  │     ├─ [root-of-the-server]__1xdv0swlxhywn._.js.map
   │     │  │     ├─ [root-of-the-server]__1xjrg42j9nszl._.js
   │     │  │     ├─ [root-of-the-server]__1xjrg42j9nszl._.js.map
   │     │  │     ├─ [turbopack]_runtime.js
   │     │  │     ├─ [turbopack]_runtime.js.map
   │     │  │     ├─ _077lnn8nkzpuv._.js
   │     │  │     ├─ _077lnn8nkzpuv._.js.map
   │     │  │     ├─ _0ekzscd0nkg6l._.js
   │     │  │     ├─ _0ekzscd0nkg6l._.js.map
   │     │  │     ├─ _0ip3hs2oz2044._.js
   │     │  │     ├─ _0ip3hs2oz2044._.js.map
   │     │  │     ├─ _10maaji0dpm-h._.js
   │     │  │     ├─ _10maaji0dpm-h._.js.map
   │     │  │     ├─ _1f3csueg3l93l._.js
   │     │  │     ├─ _1f3csueg3l93l._.js.map
   │     │  │     ├─ _1wgs3z5-_gb2i._.js
   │     │  │     ├─ _1wgs3z5-_gb2i._.js.map
   │     │  │     ├─ _1yijmrj8fcyqh._.js
   │     │  │     ├─ _1yijmrj8fcyqh._.js.map
   │     │  │     ├─ _next-internal_server_app_admin_(Dashboard)_content_page_actions_13ckhgmeou_nf.js
   │     │  │     ├─ _next-internal_server_app_admin_(Dashboard)_content_page_actions_13ckhgmeou_nf.js.map
   │     │  │     ├─ _next-internal_server_app_admin_(Dashboard)_media_page_actions_20_prrtzf12cw.js
   │     │  │     ├─ _next-internal_server_app_admin_(Dashboard)_media_page_actions_20_prrtzf12cw.js.map
   │     │  │     ├─ _next-internal_server_app_admin_(Dashboard)_messages_page_actions_1xqr3q4sgw5x8.js
   │     │  │     ├─ _next-internal_server_app_admin_(Dashboard)_messages_page_actions_1xqr3q4sgw5x8.js.map
   │     │  │     ├─ _next-internal_server_app_admin_(Dashboard)_page_actions_0if-rami5ewl7.js
   │     │  │     ├─ _next-internal_server_app_admin_(Dashboard)_page_actions_0if-rami5ewl7.js.map
   │     │  │     ├─ _next-internal_server_app_admin_login_page_actions_024efkcwjgwgn.js
   │     │  │     ├─ _next-internal_server_app_admin_login_page_actions_024efkcwjgwgn.js.map
   │     │  │     ├─ _next-internal_server_app_admin_preview_page_actions_1az6b6-1webi8.js
   │     │  │     ├─ _next-internal_server_app_admin_preview_page_actions_1az6b6-1webi8.js.map
   │     │  │     ├─ _next-internal_server_app_page_actions_0hhsz1jew5ls7.js
   │     │  │     ├─ _next-internal_server_app_page_actions_0hhsz1jew5ls7.js.map
   │     │  │     ├─ src_01piv5djqls9m._.js
   │     │  │     ├─ src_01piv5djqls9m._.js.map
   │     │  │     ├─ src_05c-3hnrzrtu4._.js
   │     │  │     ├─ src_05c-3hnrzrtu4._.js.map
   │     │  │     ├─ src_0mchcd-_0cgd3._.js
   │     │  │     ├─ src_0mchcd-_0cgd3._.js.map
   │     │  │     ├─ src_0qy1jfs-to3dr._.js
   │     │  │     ├─ src_0qy1jfs-to3dr._.js.map
   │     │  │     ├─ src_204r6j8ypsq1r._.js
   │     │  │     ├─ src_204r6j8ypsq1r._.js.map
   │     │  │     ├─ src_app_error_tsx_1gs2ol2a9g-a6._.js
   │     │  │     ├─ src_app_error_tsx_1gs2ol2a9g-a6._.js.map
   │     │  │     ├─ src_components_1ct2gk0gkm57c._.js
   │     │  │     ├─ src_components_1ct2gk0gkm57c._.js.map
   │     │  │     ├─ src_components_auth_LoginForm_tsx_1lypfo92_wu70._.js
   │     │  │     └─ src_components_auth_LoginForm_tsx_1lypfo92_wu70._.js.map
   │     │  ├─ interception-route-rewrite-manifest.js
   │     │  ├─ middleware-build-manifest.js
   │     │  ├─ middleware-manifest.json
   │     │  ├─ next-font-manifest.js
   │     │  ├─ next-font-manifest.json
   │     │  ├─ pages-manifest.json
   │     │  ├─ preview-props.json
   │     │  ├─ server-reference-manifest.js
   │     │  └─ server-reference-manifest.json
   │     ├─ static
   │     │  ├─ chunks
   │     │  │  ├─ 1daa_next_dist_compiled_react-dom_cjs_react-dom-client_development_0mp0cp_t-ezj9.js
   │     │  │  ├─ 1daa_next_dist_compiled_react-dom_cjs_react-dom-client_development_0mp0cp_t-ezj9.js.map
   │     │  │  ├─ 1q96_modules_next_dist_compiled_react-dom_cjs_react-dom_development_1sqry0_53krp4.js
   │     │  │  ├─ 1q96_modules_next_dist_compiled_react-dom_cjs_react-dom_development_1sqry0_53krp4.js.map
   │     │  │  ├─ [next]_internal_font_google_1rmh98ic5j6gn._.css
   │     │  │  ├─ [next]_internal_font_google_1rmh98ic5j6gn._.css.map
   │     │  │  ├─ [next]_internal_font_google_geist_a71539c9_module_css_1igg3k2-ikub5._.single.css
   │     │  │  ├─ [next]_internal_font_google_geist_a71539c9_module_css_1igg3k2-ikub5._.single.css.map
   │     │  │  ├─ [next]_internal_font_google_geist_mono_8d43a2aa_module_css_1igg3k2-ikub5._.single.css
   │     │  │  ├─ [next]_internal_font_google_geist_mono_8d43a2aa_module_css_1igg3k2-ikub5._.single.css.map
   │     │  │  ├─ [next]_internal_font_google_inter_6928f501_module_css_1igg3k2-ikub5._.single.css
   │     │  │  ├─ [next]_internal_font_google_inter_6928f501_module_css_1igg3k2-ikub5._.single.css.map
   │     │  │  ├─ [next]_internal_font_google_merriweather_33cab202_module_css_1igg3k2-ikub5._.single.css
   │     │  │  ├─ [next]_internal_font_google_merriweather_33cab202_module_css_1igg3k2-ikub5._.single.css.map
   │     │  │  ├─ [next]_internal_font_google_oswald_fab3d6d3_module_css_1igg3k2-ikub5._.single.css
   │     │  │  ├─ [next]_internal_font_google_oswald_fab3d6d3_module_css_1igg3k2-ikub5._.single.css.map
   │     │  │  ├─ [next]_internal_font_google_playfair_display_18b43e0c_module_css_1igg3k2-ikub5._.single.css
   │     │  │  ├─ [next]_internal_font_google_playfair_display_18b43e0c_module_css_1igg3k2-ikub5._.single.css.map
   │     │  │  ├─ [next]_internal_font_google_poppins_b8a65ce7_module_css_1igg3k2-ikub5._.single.css
   │     │  │  ├─ [next]_internal_font_google_poppins_b8a65ce7_module_css_1igg3k2-ikub5._.single.css.map
   │     │  │  ├─ [next]_internal_font_google_space_mono_7616159d_module_css_1igg3k2-ikub5._.single.css
   │     │  │  ├─ [next]_internal_font_google_space_mono_7616159d_module_css_1igg3k2-ikub5._.single.css.map
   │     │  │  ├─ [root-of-the-server]__0207e8dpve20-._.js
   │     │  │  ├─ [root-of-the-server]__0207e8dpve20-._.js.map
   │     │  │  ├─ [root-of-the-server]__02rwoq-3ieb63._.js
   │     │  │  ├─ [root-of-the-server]__02rwoq-3ieb63._.js.map
   │     │  │  ├─ [root-of-the-server]__1jw7kl0uo37a8._.css
   │     │  │  ├─ [root-of-the-server]__1jw7kl0uo37a8._.css.map
   │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_0qva5cupmdgep._.js
   │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_1mojsayzyj2p6._.js
   │     │  │  ├─ [turbopack]_browser_dev_hmr-client_hmr-client_ts_1mojsayzyj2p6._.js.map
   │     │  │  ├─ _00akewn-e8_3s._.js
   │     │  │  ├─ _00akewn-e8_3s._.js.map
   │     │  │  ├─ _00uzz14by9kbc._.js
   │     │  │  ├─ _06rkbud3pyrlm._.js.map
   │     │  │  ├─ _091j9ev1thdxq._.js
   │     │  │  ├─ _0chpz3mjl10af._.js
   │     │  │  ├─ _0chpz3mjl10af._.js.map
   │     │  │  ├─ _0fbuywuocanik._.js
   │     │  │  ├─ _0hizx99hk356c._.js
   │     │  │  ├─ _0hizx99hk356c._.js.map
   │     │  │  ├─ _0tcwge1unt86o._.js
   │     │  │  ├─ _0tyu6hwsr-l7d._.js
   │     │  │  ├─ _0tyu6hwsr-l7d._.js.map
   │     │  │  ├─ _0x8o6bn8v96lf._.js
   │     │  │  ├─ _0yh7h5f84x-7j._.js
   │     │  │  ├─ _0yh7h5f84x-7j._.js.map
   │     │  │  ├─ _1467k_uufyv8m._.js
   │     │  │  ├─ _18hksd0n035oc._.js
   │     │  │  ├─ _18hksd0n035oc._.js.map
   │     │  │  ├─ _1anvha4rlo79g._.js
   │     │  │  ├─ _1c_8oc48lli5w._.js
   │     │  │  ├─ _1cqhdh1j276l2._.js
   │     │  │  ├─ _1wng4-t308pza._.js
   │     │  │  ├─ _1x61e3zepgini._.js
   │     │  │  ├─ _1x61e3zepgini._.js.map
   │     │  │  ├─ _219uq1sj0q91c._.js
   │     │  │  ├─ src_04go3jp2qo7fi._.js
   │     │  │  ├─ src_04go3jp2qo7fi._.js.map
   │     │  │  ├─ src_07_x9cgcbu4uz._.js
   │     │  │  ├─ src_07_x9cgcbu4uz._.js.map
   │     │  │  ├─ src_07wen5bhbxyuy._.js
   │     │  │  ├─ src_07wen5bhbxyuy._.js.map
   │     │  │  ├─ src_0awj285mmwvs3._.js
   │     │  │  ├─ src_0awj285mmwvs3._.js.map
   │     │  │  ├─ src_0q-_ejx9j7enx._.js
   │     │  │  ├─ src_0q-_ejx9j7enx._.js.map
   │     │  │  ├─ src_0tbs-xnw2gr2l._.js
   │     │  │  ├─ src_0tbs-xnw2gr2l._.js.map
   │     │  │  ├─ src_1nu2dan_7uy53._.js
   │     │  │  ├─ src_1nu2dan_7uy53._.js.map
   │     │  │  ├─ src_app_globals_css_css_1igg3k2-ikub5._.single.css
   │     │  │  ├─ src_app_globals_css_css_1igg3k2-ikub5._.single.css.map
   │     │  │  ├─ src_components_admin_content_fields_0txuw-y15hiot._.js
   │     │  │  └─ turbopack-_06rkbud3pyrlm._.js
   │     │  ├─ development
   │     │  │  ├─ _buildManifest.js
   │     │  │  ├─ _clientMiddlewareManifest.js
   │     │  │  └─ _ssgManifest.js
   │     │  └─ media
   │     │     ├─ 07935285219a259d-s.1qq4vpdcun5oj.woff2
   │     │     ├─ 07a39a8a4660cc7c-s.p.0r6juujl39pe6.woff2
   │     │     ├─ 07c7676b89ed2778-s.p.2bn3s6zvc0dyp.woff2
   │     │     ├─ 1b6340a83cf1ecee-s.3ji57o093q1kd.woff2
   │     │     ├─ 1d0bb6ba8433fca1-s.2zyohmvb-ks7f.woff2
   │     │     ├─ 22a701959b157a82-s.p.2o7m9ogm38dql.woff2
   │     │     ├─ 2a04751c893bf294-s.1rgnod-3esatf.woff2
   │     │     ├─ 2bb852295097cd96-s.2dbetqa9o8jxf.woff2
   │     │     ├─ 2fb76073e23fd9e4-s.3lvt2whj97whp.woff2
   │     │     ├─ 3084de8c06b4aa35-s.44izq0ia6orkf.woff2
   │     │     ├─ 3382ae7d1c882f43-s.0we3rzhp_h228.woff2
   │     │     ├─ 34c58fc38e31639a-s.p.1s123piy9_v1m.woff2
   │     │     ├─ 41c98a3b1bc68f3a-s.2b_sldcwg6mn_.woff2
   │     │     ├─ 45462fd7b7c12654-s.0k62hbripvv8p.woff2
   │     │     ├─ 46a9e2f250689b4a-s.0-dom-5bn10r2.woff2
   │     │     ├─ 47bc4ee240b788ba-s.p.3nglv5iys3s0a.woff2
   │     │     ├─ 4d67d490d92a6baf-s.2888ryxa0751p.woff2
   │     │     ├─ 4f6667dd39116621-s.3p2_lha1f2xer.woff2
   │     │     ├─ 598176322f0e7612-s.p.1d6sb5kuiz5lw.woff2
   │     │     ├─ 599675dea67dcb8d-s.0ynx40_3oa9rk.woff2
   │     │     ├─ 5ae7380d7a1df7f9-s.0evsli58wo2lo.woff2
   │     │     ├─ 605ce01b664af129-s.p.0wgildi0cnwt9.woff2
   │     │     ├─ 6131cbbf5549afa2-s.2uwcyprjm3xu3.woff2
   │     │     ├─ 66408e03531d92c2-s.24zmmel7ed1zj.woff2
   │     │     ├─ 6bafae418e8a1b08-s.p.3o_v2fun1jzxk.woff2
   │     │     ├─ 6e342921ee4dcd9d-s.2tuy5pz7dlieh.woff2
   │     │     ├─ 76b70a1dbe058eb5-s.1y4-pdgsjb-pw.woff2
   │     │     ├─ 76e9fd951b869c7b-s.p.3bh2vc0w-r-ll.woff2
   │     │     ├─ 77814b00d5ca94a4-s.21jp631_3pja2.woff2
   │     │     ├─ 77b28ce38026b284-s.0fuxtgzazslqx.woff2
   │     │     ├─ 8a09af449e2019ec-s.0die5hfoqv6qs.woff2
   │     │     ├─ 9d036f80216c14ee-s.p.3u4lli0-axodc.woff2
   │     │     ├─ 9eb5a876700c0028-s.1uyisp29ctx0d.woff2
   │     │     ├─ ab56636924653a94-s.p.3cik_s2si-ft-.woff2
   │     │     ├─ b0b9e5e07c9deaa9-s.3go-kn2r40gie.woff2
   │     │     ├─ b0c6b664fd57c2c6-s.31988l_ccedte.woff2
   │     │     ├─ b0e156020fd1d73f-s.3jppgd0xzx-0d.woff2
   │     │     ├─ ba63f6a0e436df8e-s.3-6t-g6q0vh0a.woff2
   │     │     ├─ c0743afb7b1f57bc-s.11ypmpdlzqdb_.woff2
   │     │     ├─ c442f25284480cdf-s.451yigaaz_4mg.woff2
   │     │     ├─ c56b7902cf1158e2-s.3zpf07psjg673.woff2
   │     │     ├─ cdf6f527ee34c972-s.1975l3y3401x_.woff2
   │     │     ├─ d89abe7e263475e6-s.19xuq3td7fwu_.woff2
   │     │     ├─ dd9dfc3601372168-s.p.43zbiuwnnoiok.woff2
   │     │     ├─ df04fd3b90ce4840-s.081af6y49e67w.woff2
   │     │     ├─ e84c5cd1ffbefa6f-s.1emuuracu50qd.woff2
   │     │     ├─ ece6651c07dc3133-s.0t8ljjjn9wtsx.woff2
   │     │     ├─ f58031ded4338640-s.390ncx5urfkfu.woff2
   │     │     ├─ f8121d030447d80e-s.2dw4wc11szodo.woff2
   │     │     └─ fe66ef18334e70b5-s.12jw9x3xnpuw8.woff2
   │     ├─ trace
   │     └─ types
   │        ├─ cache-life.d.ts
   │        ├─ root-params.d.ts
   │        ├─ routes.d.ts
   │        └─ validator.ts
   ├─ README.md
   ├─ eslint.config.mjs
   ├─ next.config.ts
   ├─ package-lock.json
   ├─ package.json
   ├─ public
   │  └─ images
   │     ├─ about.jpg
   │     ├─ project-1.jpg
   │     ├─ project-2.jpg
   │     ├─ project-3.jpg
   │     ├─ project-4.jpg
   │     └─ project-5.jpg
   ├─ src
   │  ├─ app
   │  │  ├─ admin
   │  │  │  ├─ (Dashboard)
   │  │  │  │  ├─ AppearanceEditor.tsx
   │  │  │  │  ├─ appearance
   │  │  │  │  │  ├─ actions.ts
   │  │  │  │  │  └─ page.tsx
   │  │  │  │  ├─ content
   │  │  │  │  │  └─ page.tsx
   │  │  │  │  ├─ layout.tsx
   │  │  │  │  ├─ media
   │  │  │  │  │  └─ page.tsx
   │  │  │  │  ├─ messages
   │  │  │  │  │  └─ page.tsx
   │  │  │  │  ├─ navigation
   │  │  │  │  │  └─ page.tsx
   │  │  │  │  ├─ page.tsx
   │  │  │  │  ├─ projects
   │  │  │  │  │  └─ page.tsx
   │  │  │  │  ├─ sections
   │  │  │  │  │  ├─ actions.ts
   │  │  │  │  │  └─ page.tsx
   │  │  │  │  └─ services
   │  │  │  │     └─ page.tsx
   │  │  │  ├─ login
   │  │  │  │  └─ page.tsx
   │  │  │  └─ preview
   │  │  │     └─ page.tsx
   │  │  ├─ api
   │  │  │  ├─ admin
   │  │  │  │  ├─ media
   │  │  │  │  │  ├─ [id]
   │  │  │  │  │  │  └─ route.ts
   │  │  │  │  │  └─ route.ts
   │  │  │  │  ├─ messages
   │  │  │  │  │  └─ [id]
   │  │  │  │  │     └─ route.ts
   │  │  │  │  ├─ navigation
   │  │  │  │  │  └─ route.ts
   │  │  │  │  ├─ projects
   │  │  │  │  │  └─ route.ts
   │  │  │  │  ├─ sections
   │  │  │  │  │  └─ [id]
   │  │  │  │  │     └─ content
   │  │  │  │  │        └─ route.ts
   │  │  │  │  ├─ services
   │  │  │  │  │  └─ route.ts
   │  │  │  │  ├─ site-settings
   │  │  │  │  │  └─ route.ts
   │  │  │  │  └─ social-links
   │  │  │  │     └─ route.ts
   │  │  │  └─ auth
   │  │  │     ├─ login
   │  │  │     │  └─ route.ts
   │  │  │     ├─ logout
   │  │  │     │  └─ route.ts
   │  │  │     └─ me
   │  │  │        └─ route.ts
   │  │  ├─ error.tsx
   │  │  ├─ globals.css
   │  │  ├─ layout.tsx
   │  │  ├─ not-found.tsx
   │  │  ├─ page.tsx
   │  │  └─ projects
   │  │     └─ [slug]
   │  │        └─ page.tsx
   │  ├─ components
   │  │  ├─ SiteTheme.tsx
   │  │  ├─ admin
   │  │  │  ├─ AdminShell.tsx
   │  │  │  ├─ AdminSidebar.tsx
   │  │  │  ├─ Combobox.tsx
   │  │  │  ├─ ContentEditor.tsx
   │  │  │  ├─ SectionsList.tsx
   │  │  │  ├─ StickyActionBar.tsx
   │  │  │  ├─ catalog
   │  │  │  │  ├─ CatalogHeader.tsx
   │  │  │  │  ├─ ProjectsManager.tsx
   │  │  │  │  ├─ ServicesManager.tsx
   │  │  │  │  └─ Thumb.tsx
   │  │  │  ├─ content
   │  │  │  │  ├─ CardsSummary.tsx
   │  │  │  │  ├─ CatalogContext.ts
   │  │  │  │  ├─ LinkTargetsContext.ts
   │  │  │  │  ├─ MediaContext.ts
   │  │  │  │  ├─ SectionForm.tsx
   │  │  │  │  ├─ fields
   │  │  │  │  │  ├─ ArrayItemsEditor.tsx
   │  │  │  │  │  ├─ IconField.tsx
   │  │  │  │  │  ├─ IconGlyph.tsx
   │  │  │  │  │  ├─ IconPickerDialog.tsx
   │  │  │  │  │  ├─ ImageField.tsx
   │  │  │  │  │  ├─ LinkField.tsx
   │  │  │  │  │  ├─ MediaPicker.tsx
   │  │  │  │  │  └─ TextField.tsx
   │  │  │  │  └─ forms
   │  │  │  │     ├─ AboutForm.tsx
   │  │  │  │     ├─ CTAForm.tsx
   │  │  │  │     ├─ CertificationsForm.tsx
   │  │  │  │     ├─ ClientsForm.tsx
   │  │  │  │     ├─ ContactForm.tsx
   │  │  │  │     ├─ FAQForm.tsx
   │  │  │  │     ├─ GalleryForm.tsx
   │  │  │  │     ├─ HeroForm.tsx
   │  │  │  │     ├─ ProcessForm.tsx
   │  │  │  │     ├─ ProjectsForm.tsx
   │  │  │  │     ├─ ServicesForm.tsx
   │  │  │  │     ├─ StatsForm.tsx
   │  │  │  │     ├─ TeamForm.tsx
   │  │  │  │     ├─ TestimonialsForm.tsx
   │  │  │  │     ├─ WhyChooseUsForm.tsx
   │  │  │  │     └─ types.ts
   │  │  │  ├─ media
   │  │  │  │  ├─ MediaDetailsDialog.tsx
   │  │  │  │  ├─ MediaLibrary.tsx
   │  │  │  │  ├─ MediaUploadForm.tsx
   │  │  │  │  ├─ Modal.tsx
   │  │  │  │  └─ mediaFormat.ts
   │  │  │  ├─ messages
   │  │  │  │  └─ MessagesInbox.tsx
   │  │  │  ├─ navigation
   │  │  │  │  ├─ ListRow.tsx
   │  │  │  │  ├─ NavigationEditor.tsx
   │  │  │  │  ├─ NavigationLinksCard.tsx
   │  │  │  │  ├─ SocialLinksEditor.tsx
   │  │  │  │  └─ fields.tsx
   │  │  │  └─ preview
   │  │  │     ├─ DeviceSwitcher.tsx
   │  │  │     ├─ LiveSectionPreview.tsx
   │  │  │     ├─ PreviewFrame.tsx
   │  │  │     └─ SectionPreviewPanel.tsx
   │  │  ├─ auth
   │  │  │  ├─ LoginForm.tsx
   │  │  │  └─ LogoutButton.tsx
   │  │  └─ portfolio
   │  │     ├─ Footer.tsx
   │  │     ├─ Navbar.tsx
   │  │     ├─ Reveal.tsx
   │  │     ├─ ScrollReset.tsx
   │  │     ├─ ScrollToTop.tsx
   │  │     └─ sections
   │  │        ├─ About.tsx
   │  │        ├─ CTA.tsx
   │  │        ├─ Certifications.tsx
   │  │        ├─ Clients.tsx
   │  │        ├─ Contact.tsx
   │  │        ├─ FAQ.tsx
   │  │        ├─ Gallery.tsx
   │  │        ├─ Hero.tsx
   │  │        ├─ HeroFrame.tsx
   │  │        ├─ Process.tsx
   │  │        ├─ Projects.tsx
   │  │        ├─ SectionRenderer.tsx
   │  │        ├─ Services.tsx
   │  │        ├─ Stats.tsx
   │  │        ├─ Team.tsx
   │  │        ├─ Testimonials.tsx
   │  │        └─ WhyChooseUs.tsx
   │  ├─ lib
   │  │  ├─ api
   │  │  │  ├─ admin
   │  │  │  │  ├─ client.ts
   │  │  │  │  ├─ dashboard.ts
   │  │  │  │  ├─ http.ts
   │  │  │  │  ├─ messages.ts
   │  │  │  │  ├─ proxy.ts
   │  │  │  │  └─ sections.ts
   │  │  │  ├─ client.ts
   │  │  │  ├─ companyServices.ts
   │  │  │  ├─ contactMessages.ts
   │  │  │  ├─ media.ts
   │  │  │  ├─ navigation.ts
   │  │  │  ├─ projects.ts
   │  │  │  ├─ sections.ts
   │  │  │  ├─ siteSettings.ts
   │  │  │  ├─ socialLinks.ts
   │  │  │  └─ themes.ts
   │  │  ├─ site
   │  │  │  ├─ navigationLinks.ts
   │  │  │  ├─ sectionAnchors.ts
   │  │  │  ├─ sectionDescriptions.ts
   │  │  │  └─ socialPlatforms.ts
   │  │  └─ ui
   │  │     ├─ icons.ts
   │  │     ├─ mediaUrl.ts
   │  │     └─ portfolioFonts.ts
   │  ├─ schemas
   │  │  ├─ catalogSchemas.ts
   │  │  ├─ mediaSchemas.ts
   │  │  ├─ navigationSchemas.ts
   │  │  └─ sectionSchemas.ts
   │  └─ types
   │     ├─ apiSections.ts
   │     ├─ companyService.ts
   │     ├─ contactMessage.ts
   │     ├─ dashboardStats.ts
   │     ├─ media.ts
   │     ├─ navigation.ts
   │     ├─ project.ts
   │     ├─ section.ts
   │     ├─ sectionContent.ts
   │     ├─ siteSettings.ts
   │     ├─ socialLink.ts
   │     └─ theme.ts
   └─ tsconfig.json

```