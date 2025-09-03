using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Events;
using Pluxy3dBE.Repository.Data;
using Pluxy3dBE.Extensions;

// Bootstrap Serilog (will be reconfigured with appsettings below)
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
        // TODO: Agregar módulos de composición cuando estén listos
        // CompositionRoot.ConfigureContainer(containerBuilder, builder.Configuration);
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

    // Migrar/crear esquema en el arranque
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContextFromDb>();
            try
            {
                await db.Database.MigrateAsync();
            }
            catch (Exception ex)
            {
                Log.Warning(ex, "Fallo al aplicar migraciones, intentando EnsureCreated");
                await db.Database.EnsureCreatedAsync();
            }
        }
        catch (Exception ex)
        {
            Log.Warning(ex, "No se pudo asegurar la creación del esquema de base de datos");
        }
    }

    // TEMPORAL: Seed comentado hasta regenerar entidades
    //await SeedDataAsync(app);

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

