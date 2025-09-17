using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/categorias")]
public class CategoriasController : ControllerBase
{
    private readonly ICategoriaService _categorias;

    public CategoriasController(ICategoriaService categorias)
    {
        _categorias = categorias;
    }
    [HttpGet]
    [ResponseCache(Duration = 3600, Location = ResponseCacheLocation.Any, NoStore = false)]
    public async Task<IActionResult> Get()
    {
        var cats = await _categorias.GetCategoriasAsync();
        return Ok(cats);
    }
}
