using System.Reflection;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Pluxy3dBE.Repository.Data;
using Pluxy3dBE.Repositories.Cart;
using Pluxy3dBE.Repositories.Cart.InMemory;
using Pluxy3dBE.Services.Cart;
using Pluxy3dBE.Repositories.Product;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.ResponseCompression;
using System.IO.Compression;
using Serilog.Events;
using Pluxy3dBE.Repositories.Cart.Ef;

// Configuración básica de Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .WriteTo.Console()
    .WriteTo.File("logs/pluxy3d-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

try
{
    Log.Information("Iniciando Pluxy3D Backend API");

    var builder = WebApplication.CreateBuilder(args);

    // Configurar Serilog
    builder.Host.UseSerilog();

    // Configurar Autofac como contenedor de DI
    builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
    builder.Host.ConfigureContainer<ContainerBuilder>(containerBuilder =>
    {
        // TODO: Agregar módulos de composición cuando estén listos
        // CompositionRoot.ConfigureContainer(containerBuilder, builder.Configuration);
    });

    // Configuración de servicios básicos
    builder.Services.AddControllers();

    // Configuración de base de datos - actualizada para usar Pluxy3dDB
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ??
                          Environment.GetEnvironmentVariable("DATABASE_CONNECTION") ??
                          "Server=TUCHOPC\\SQLEXPRESS;Database=Pluxy3dDB;Trusted_Connection=True;TrustServerCertificate=True;";

    builder.Services.AddDbContextPool<AppDbContextFromDb>(options =>
        options
            .UseSqlServer(connectionString, sql =>
            {
                sql.EnableRetryOnFailure(5, TimeSpan.FromSeconds(2), null);
                sql.CommandTimeout(30);
            })
            .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
    );

    builder.Services.AddScoped<IProductRepository, EfProductRepository>();

    // Repositorio y Servicio de Carrito - EF ahora
    builder.Services.AddScoped<ICartRepository, EfCartRepository>();
    builder.Services.AddScoped<ICartService, CartService>();

    // AutoMapper - comentado temporalmente debido a conflicto de paquetes
    // var currentAssembly = System.Reflection.Assembly.GetExecutingAssembly();
    // builder.Services.AddAutoMapper(currentAssembly);

    // Configuración de CORS
    var allowedOrigins = Environment.GetEnvironmentVariable("CORS_ORIGINS")?.Split(';') ??
                        new[] { "http://localhost:3000", "http://localhost:3001" };

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend", policy =>
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials());
    });

    // Configuración de OpenAPI/Swagger
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new()
        {
            Title = "Pluxy3D API",
            Version = "v1",
            Description = "API para la tienda de impresión 3D Pluxy3D",
            Contact = new()
            {
                Name = "Equipo Pluxy3D",
                Email = "dev@pluxy3d.com"
            }
        });

        // Incluir comentarios XML
        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        if (File.Exists(xmlPath))
        {
            c.IncludeXmlComments(xmlPath);
        }
    });

    // Health checks - temporalmente comentado hasta migración completa
    builder.Services.AddHealthChecks();
        // .AddDbContextCheck<AppDbContextFromDb>();

    // JSON: omitir nulos para reducir payload
    builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

    // Cache y compresión
    builder.Services.AddMemoryCache();
    builder.Services.AddResponseCaching();
    builder.Services.AddResponseCompression(opts =>
    {
        opts.EnableForHttps = true;
        opts.Providers.Add<BrotliCompressionProvider>();
        opts.Providers.Add<GzipCompressionProvider>();
    });
    builder.Services.Configure<BrotliCompressionProviderOptions>(o => o.Level = CompressionLevel.Optimal);
    builder.Services.Configure<GzipCompressionProviderOptions>(o => o.Level = CompressionLevel.Optimal);

    var app = builder.Build();

    // Configuración del pipeline de middleware
    app.UseSerilogRequestLogging(options =>
    {
        options.EnrichDiagnosticContext = (diagnosticContext, httpContext) =>
        {
            diagnosticContext.Set("RequestPath", (string?)httpContext.Request.Path);
        };
        options.GetLevel = (httpContext, elapsedMs, ex) => ex != null ? LogEventLevel.Error : LogEventLevel.Information;
    });

    // Manejo de errores
    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        
        // Swagger
        var enableSwagger = builder.Configuration.GetValue<bool>("EnableSwagger", true) ||
                           Environment.GetEnvironmentVariable("ENABLE_SWAGGER") == "true";
        
        if (enableSwagger)
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Pluxy3D API v1");
                c.RoutePrefix = "swagger";
                c.DisplayRequestDuration();
                c.EnableDeepLinking();
                c.EnableFilter();
            });
        }
    }
    else
    {
        app.UseExceptionHandler("/Error");
        app.UseHsts();
    }

    // Middleware de seguridad y rendimiento
    app.UseHttpsRedirection();
    app.UseResponseCompression();
    app.UseResponseCaching();

    // CORS
    app.UseCors("AllowFrontend");

    // Routing
    app.UseRouting();

    // Health checks
    app.UseHealthChecks("/health");

    // Mapeo de controladores
    app.MapControllers();

    // Endpoint raíz
    app.MapGet("/", () => "Pluxy3D Backend API está funcionando correctamente! 🚀");

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

