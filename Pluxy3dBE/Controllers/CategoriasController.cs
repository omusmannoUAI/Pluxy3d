using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/categorias")]
public class CategoriasController(ICategoriaService categorias) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
    var cats = await categorias.GetCategoriasAsync();
    return Ok(cats);
    }
}
