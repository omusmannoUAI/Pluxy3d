using System.IO.Compression;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Pluxy3dBE.Repository.Data;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Repository.Repositories;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.Domain.Services;
using System.Text.Json.Serialization;
using Pluxy3dBE.DomainContracts.Commands;
using Pluxy3dBE.DomainContracts.Payment;
using Pluxy3dBE.DomainContracts.States;
using Pluxy3dBE.DomainContracts.Events;
using Pluxy3dBE.DomainContracts.Authorization;
using Pluxy3dBE.DomainContracts.Templates;
using Pluxy3dBE.DalContracts.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Microsoft.OpenApi.Models;

namespace Pluxy3dBE.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddControllers(options =>
            {
                options.Filters.Add<Pluxy3dBE.Filters.PagedResultHeadersFilter>();
            })
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
                options
                    .UseSqlite(cs)
                    .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                    .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
            }
            else
            {
                options
                    .UseSqlServer(cs, sql =>
                    {
                        sql.EnableRetryOnFailure(5, TimeSpan.FromSeconds(2), null);
                        sql.CommandTimeout(30);
                    })
                    .UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking)
                    .ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
            }
        });

        // DAL repositories (shared projects)
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<IProductoRepository, ProductoRepository>();
        services.AddScoped<ICarritoRepository, CarritoRepository>();
        services.AddScoped<ICategoriaRepository, CategoriaRepository>();
        services.AddScoped<IEstadoVentaRepository, EstadoVentaRepository>();
        services.AddScoped<IVentaRepository, VentaRepository>();

        // Domain services
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<IProductoService, ProductoService>();
        services.AddScoped<ICarritoService, CarritoService>();
        services.AddScoped<ICategoriaService, CategoriaService>();
        services.AddScoped<Pluxy3dBE.DomainContracts.Services.IContactoService, Pluxy3dBE.Domain.Services.ContactoService>();
        services.AddSingleton<IAuthorizationStrategyFactory, AuthorizationStrategyFactory>();
        services.AddScoped<Pluxy3dBE.DomainContracts.Authorization.IAuthorizationService, AuthorizationService>();
        services.AddScoped<IVentaService, VentaService>();
        services.AddSingleton<IPaymentProcessorFactory, PaymentProcessorFactory>();
        services.AddSingleton<IVentaStateFactory, VentaStateFactory>();
        services.AddSingleton<IDomainEventPublisher, DomainEventPublisher>();
        services.AddSingleton<VentaProcessorFactory>();
        // Command pattern for carrito
        services.AddScoped<ICommandDispatcher, CommandDispatcher>();
        services.AddSingleton<ICarritoCommandFactory, CarritoCommandFactory>();

        // Health checks
        services.AddHealthChecks()
            .AddDbContextCheck<AppDbContextFromDb>();

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

        // Authentication (JWT) - infraestructura lista, sin aplicar a controladores aún
        var jwtKey = config["Jwt:Key"];
        if (!string.IsNullOrWhiteSpace(jwtKey))
        {
            var keyBytes = Encoding.UTF8.GetBytes(jwtKey);
            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = config["Jwt:Issuer"],
                        ValidAudience = config["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
                    };
                });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
            });
        }

        // Swagger security (JWT Bearer)
        services.AddSwaggerGen(c =>
        {
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer",
                BearerFormat = "JWT",
                In = ParameterLocation.Header,
                Description = "JWT Authorization header. Example: 'Bearer {token}'"
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });

        // Rate limiting (IP-based) para endpoints sensibles
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = 429;
            options.AddPolicy("contacto-read", httpContext =>
            {
                var key = httpContext.Connection.RemoteIpAddress?.ToString() ?? "anon";
                return RateLimitPartition.GetFixedWindowLimiter(key, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 60,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0,
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst
                });
            });
            options.AddPolicy("contacto-write", httpContext =>
            {
                var key = httpContext.Connection.RemoteIpAddress?.ToString() ?? "anon";
                return RateLimitPartition.GetFixedWindowLimiter(key, _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 10,
                    Window = TimeSpan.FromMinutes(1),
                    QueueLimit = 0,
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst
                });
            });
        });

        return services;
    }
}
