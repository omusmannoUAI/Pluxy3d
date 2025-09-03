using System.IO.Compression;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Pluxy3dBE.Repository.Data;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Repository.Repositories;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.Domain.Services;
using System.Text.Json.Serialization;

namespace Pluxy3dBE.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            });

        // DbContext (supports SQL Server or SQLite based on connection string)
        var connectionString = config.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            // Fallback to local SQLite DB if not configured
            connectionString = "Data Source=pluxy3d.db";
        }
        services.AddDbContextPool<AppDbContextFromDb>(options =>
        {
            var cs = connectionString ?? string.Empty;
            var isSQLite = cs.Contains("Data Source=", StringComparison.OrdinalIgnoreCase)
                           && !cs.Contains("Server=", StringComparison.OrdinalIgnoreCase);

            if (isSQLite)
            {
                options.UseSqlite(cs).UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }
            else
            {
                options.UseSqlServer(cs, sql =>
                {
                    sql.EnableRetryOnFailure(5, TimeSpan.FromSeconds(2), null);
                    sql.CommandTimeout(30);
                }).UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            }
        });

        // DAL repositories (shared projects)
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IProductoRepository, ProductoRepository>();
        services.AddScoped<ICarritoRepository, CarritoRepository>();

        // Domain services
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<IProductoService, ProductoService>();
        services.AddScoped<ICarritoService, CarritoService>();

        // Health checks
        services.AddHealthChecks();
        // .AddDbContextCheck<AppDbContextFromDb>();

        // AutoMapper (Domain profiles)
        services.AddAutoMapper(typeof(Pluxy3dBE.Domain.Mappings.ProductoProfile).Assembly);

        // CORS
        var allowedOrigins = config.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                if (allowedOrigins.Length > 0)
                {
                    policy.WithOrigins(allowedOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                }
                else
                {
                    // If no origins configured, allow any origin (no credentials allowed with wildcard)
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                }
            });
        });

        // Caching & Compression
        services.AddMemoryCache();
        services.AddResponseCaching();
        services.AddResponseCompression(opts =>
        {
            opts.EnableForHttps = true;
            opts.Providers.Add<BrotliCompressionProvider>();
            opts.Providers.Add<GzipCompressionProvider>();
        });
        services.Configure<BrotliCompressionProviderOptions>(o => o.Level = CompressionLevel.Optimal);
        services.Configure<GzipCompressionProviderOptions>(o => o.Level = CompressionLevel.Optimal);

        // Swagger/OpenAPI
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
            {
                Title = "Pluxy3D API",
                Version = "v1",
                Description = "API para la tienda de impresión 3D Pluxy3D"
            });

            var xmlFile = System.Reflection.Assembly.GetExecutingAssembly().GetName().Name + ".xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            if (File.Exists(xmlPath))
            {
                c.IncludeXmlComments(xmlPath);
            }
        });

        return services;
    }
}
