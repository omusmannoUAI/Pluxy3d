using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/categorias")]
public class CategoriasController(IProductoService productos) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
    var cats = await productos.GetCategoriasAsync();
    return Ok(cats);
    }
}
