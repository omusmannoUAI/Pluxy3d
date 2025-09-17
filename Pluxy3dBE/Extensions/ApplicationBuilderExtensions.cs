using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Pluxy3dBE.Middlewares;

namespace Pluxy3dBE.Extensions;

public static class ApplicationBuilderExtensions
{
    public static WebApplication UseApiPipeline(this WebApplication app, IConfiguration config)
    {
        // Forwarded headers (Azure/App Service)
        app.UseForwardedHeaders(new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
        });

        // Optional PathBase from config
        var pathBase = config["PathBase"];
        if (!string.IsNullOrWhiteSpace(pathBase))
        {
            app.UsePathBase(pathBase);
        }

        // Serilog request logging is configured in Program (host)

        // Error handling & HSTS
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        // Swagger only in development
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // Custom global exception handler
        app.UseMiddleware<GlobalExceptionMiddleware>();

        app.UseHttpsRedirection();
        app.UseMiddleware<SecurityHeadersMiddleware>();
        app.UseResponseCompression();
        app.UseResponseCaching();
        app.UseRateLimiter();
        app.UseCors("AllowFrontend");
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();
        // Map health checks via endpoints (works well under Azure/App Service and PathBase)
        app.MapHealthChecks("/health");
        app.MapHealthChecks("/hc");
        app.MapGet("/healthz", () => Results.Ok("OK"));
        app.MapControllers();

        // Root endpoint
        app.MapGet("/", () => "Pluxy3D Backend API está funcionando correctamente! 🚀");

        return app;
    }
}
