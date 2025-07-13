using System.Reflection;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Pluxy3dBE.Repository.Data;

// Configuración básica de Serilog
Log.Logger = new LoggerConfiguration()
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

    // Configuración de base de datos - usar el contexto generado desde la BD existente
    // Configurar Entity Framework con el nuevo contexto generado desde BD
    // TODO: Descomentar después de que la arquitectura esté completamente migrada
    // builder.Services.AddDbContext<AppDbContextFromDb>(options =>
    //     options.UseSqlServer(connectionString));

    // Los registros legacy están comentados hasta completar la migración
    // builder.Services.AddScoped<Pluxy3dBE.Repositories.IProductoRepository, Pluxy3dBE.Repositories.ProductoRepository>();
    // builder.Services.AddScoped<Pluxy3dBE.Services.ProductoService>();
    // builder.Services.AddScoped<Pluxy3dBE.Repositories.ICarritoRepository, Pluxy3dBE.Repositories.CarritoRepository>();
    // builder.Services.AddScoped<Pluxy3dBE.Services.CarritoService>();

    // Registros de la nueva arquitectura - comentados hasta adaptar
    // builder.Services.AddScoped<Pluxy3dBE.DalContracts.IProductoRepository, Pluxy3dBE.Repository.Repositories.ProductoRepository>();
    // builder.Services.AddScoped<Pluxy3dBE.DomainContracts.Services.IProductoService, Pluxy3dBE.Domain.Services.ProductoService>();

    // AutoMapper - comentado temporalmente debido a conflicto de paquetes
    // var currentAssembly = System.Reflection.Assembly.GetExecutingAssembly();
    // builder.Services.AddAutoMapper(currentAssembly);

    // Configuración de CORS
    var allowedOrigins = Environment.GetEnvironmentVariable("CORS_ORIGINS")?.Split(';') ?? 
                        new[] { "http://localhost:3000" };

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

    // Cache y compresión
    builder.Services.AddMemoryCache();
    builder.Services.AddResponseCaching();
    builder.Services.AddResponseCompression();

    var app = builder.Build();

    // Configuración del pipeline de middleware
    app.UseSerilogRequestLogging();

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

// TODO: Restaurar función de seeding después de migración completa
/*
static async Task SeedDataAsync(WebApplication app)
{
    try
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContextFromDb>();
        
        // La base de datos ya existe, solo verificamos si necesitamos datos iniciales
        
        // Verificar si hay productos existentes
        if (!await db.Productos.AnyAsync())
        {
            Log.Information("No hay productos en la base de datos, agregando datos de ejemplo...");
            
            // Como la estructura es diferente, solo agregamos algunos productos básicos
            // Los campos exactos dependen del esquema de la BD existente
            Log.Information("Para agregar productos, necesitas verificar la estructura exacta de la tabla Productos en la BD");
        }
        else
        {
            var productCount = await db.Productos.CountAsync();
            Log.Information("Base de datos ya contiene {ProductCount} productos", productCount);
        }
        
        // Limpiar carrito existente
        var existingCartItems = await db.CarritoItems.ToListAsync();
        if (existingCartItems.Any())
        {
            db.CarritoItems.RemoveRange(existingCartItems);
            await db.SaveChangesAsync();
            Log.Information("Carrito limpiado");
        }

        Log.Information("Base de datos inicializada correctamente");
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Error al inicializar la base de datos");
        throw;
    }
}
*/
