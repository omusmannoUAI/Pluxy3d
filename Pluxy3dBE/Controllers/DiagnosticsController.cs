using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/diagnostics")]
public class DiagnosticsController : ControllerBase
{
    private readonly AppDbContextFromDb _db;
    private readonly IHostEnvironment _env;
    private readonly ILogger<DiagnosticsController> _logger;

    public DiagnosticsController(AppDbContextFromDb db, IHostEnvironment env, ILogger<DiagnosticsController> logger)
    {
        _db = db;
        _env = env;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        // Only allow diagnostics in Development to avoid leaking details in production.
        if (!_env.IsDevelopment())
        {
            return NotFound();
        }

        try
        {
            var canConnect = await _db.Database.CanConnectAsync();
            var pending = Array.Empty<string>();
            try
            {
                pending = (await _db.Database.GetPendingMigrationsAsync()).ToArray();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get pending migrations");
            }

            return Ok(new
            {
                Environment = _env.EnvironmentName,
                CanConnectToDatabase = canConnect,
                PendingMigrations = pending,
                Timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Diagnostics check failed");
            return Problem(detail: "Error interno del servidor", statusCode: 500);
        }
    }
}
