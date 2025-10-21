using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using Pluxy3dBE.Repository.Data;
using Pluxy3dBE.Extensions;

// Bootstrap Serilog (will be reconfigured with appsettings below)
// Updated deployment with correct Azure publish profile
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .WriteTo.Console()
    .CreateLogger();

try
{
    Log.Information("Iniciando Pluxy3D Backend API");

    var builder = WebApplication.CreateBuilder(args);

    // Configure Serilog (file path from configuration)
    var logFile = builder.Configuration["Logging:FilePath"] ?? Path.Combine("logs", "pluxy3d-.txt");
    Log.Logger = new LoggerConfiguration()
        .MinimumLevel.Information()
        .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
        .WriteTo.Console()
        .WriteTo.File(logFile, rollingInterval: RollingInterval.Day, shared: true)
        .CreateLogger();
    builder.Host.UseSerilog();

    // Configurar Autofac como contenedor de DI
    builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
    builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
    {
        // Explicit Autofac registrations to ensure resolution at runtime
        // (in addition to Microsoft DI registrations in AddApiServices)
        containerBuilder.RegisterType<Pluxy3dBE.Repository.Repositories.VentaRepository>()
            .As<Pluxy3dBE.DalContracts.Repositories.IVentaRepository>()
            .InstancePerLifetimeScope();

        containerBuilder.RegisterType<Pluxy3dBE.Repository.Repositories.EstadoVentaRepository>()
            .As<Pluxy3dBE.DalContracts.IEstadoVentaRepository>()
            .InstancePerLifetimeScope();

        containerBuilder.RegisterType<Pluxy3dBE.Domain.Services.VentaService>()
            .As<Pluxy3dBE.DomainContracts.Services.IVentaService>()
            .InstancePerLifetimeScope();

        // Authorization binding (avoid collision with ASP.NET Core Authorization service)
        containerBuilder.RegisterType<Pluxy3dBE.Domain.Services.AuthorizationService>()
            .As<Pluxy3dBE.DomainContracts.Authorization.IAuthorizationService>()
            .InstancePerLifetimeScope();
    });

    // Services organized in extension
    builder.Services.AddApiServices(builder.Configuration);

    var app = builder.Build();

    // Request logging
    app.UseSerilogRequestLogging(options =>
    {
        options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
            diagnosticContext.Set("RequestPath", (string?)httpContext.Request.Path);
        };
        options.GetLevel = (httpContext, elapsedMs, ex) => ex != null ? LogEventLevel.Error : LogEventLevel.Information;
    });

    // Pipeline organized in extension (includes forwarded headers, error handling, swagger in Dev, caching, cors, routing, health, controllers, root endpoint)
    app.UseApiPipeline(builder.Configuration);

    // Migrar/crear esquema en el arranque (configurable)
    var applyMigrations = builder.Configuration.GetValue("ApplyMigrationsOnStartup", true);
    if (applyMigrations)
    {
        using var scope = app.Services.CreateScope();
        try
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContextFromDb>();
            try
            {
                await db.Database.MigrateAsync();
            }
            catch (Exception ex)
            {
                Log.Warning(ex, "Fallo al aplicar migraciones. Saltando EnsureCreated en producción.");
                var isDevelopment = app.Environment.IsDevelopment();
                if (isDevelopment)
                {
                    await db.Database.EnsureCreatedAsync();
                }
            }
            // Ejecutar seeding mínimo (categorías) si es necesario
            try
            {
                await Pluxy3dBE.Data.DbInitializer.SeedAsync(app.Services);
            }
            catch (Exception ex)
            {
                Log.Warning(ex, "Seeding failed");
            }

        }
        catch (Exception ex)
        {
            Log.Warning(ex, "No se pudo asegurar la creación del esquema de base de datos");
        }
    }

    Log.Information("Pluxy3D Backend API iniciada correctamente");
    await app.RunAsync();
}
catch (Exception ex)
{
    Log.Fatal(ex, "La aplicación falló al iniciar");
}
finally
{
    Log.CloseAndFlush();
}

