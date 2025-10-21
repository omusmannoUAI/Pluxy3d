using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Pluxy3dBE.DomainContracts.Services;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/categorias")]
public class CategoriasController : ControllerBase
{
    private readonly ICategoriaService _categorias;
    private readonly ILogger<CategoriasController> _logger;

    public CategoriasController(ICategoriaService categorias, ILogger<CategoriasController> logger)
    {
        _categorias = categorias;
        _logger = logger;
    }

    [HttpGet]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any, NoStore = false)]
    public async Task<IActionResult> Get()
    {
        try
        {
            var cats = await _categorias.GetCategoriasAsync();
            return Ok(cats);
        }
        catch (Exception ex)
        {
            // Log full exception server-side for diagnosis, but return a generic message to clients
            _logger.LogError(ex, "Error while getting categories");
            // Do not leak exception details to the client in production
            return Problem(detail: "Error interno del servidor", statusCode: 500);
        }
    }
}
