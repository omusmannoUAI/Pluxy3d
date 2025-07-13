using System.Net;
using System.Text.Json;

namespace Pluxy3dBE.Middlewares;

/// <summary>
/// Middleware para manejo global de excepciones
/// </summary>
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private readonly IWebHostEnvironment _environment;

    public GlobalExceptionMiddleware(
        RequestDelegate next, 
        ILogger<GlobalExceptionMiddleware> logger,
        IWebHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Excepción no manejada: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        // Personalizar el código de estado según el tipo de excepción
        context.Response.StatusCode = exception switch
        {
            ArgumentNullException => (int)HttpStatusCode.BadRequest,
            ArgumentException => (int)HttpStatusCode.BadRequest,
            UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
            NotImplementedException => (int)HttpStatusCode.NotImplemented,
            _ => (int)HttpStatusCode.InternalServerError
        };

        object response;

        // En desarrollo, incluir más detalles del error
        if (_environment.IsDevelopment())
        {
            response = new
            {
                message = exception.Message,
                statusCode = context.Response.StatusCode,
                timestamp = DateTime.UtcNow,
                path = context.Request.Path.Value,
                stackTrace = exception.StackTrace,
                innerException = exception.InnerException?.Message
            };
        }
        else
        {
            response = new
            {
                message = "Error interno del servidor",
                statusCode = context.Response.StatusCode,
                timestamp = DateTime.UtcNow,
                path = context.Request.Path.Value
            };
        }

        var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}
