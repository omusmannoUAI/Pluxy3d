using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/productos")]
public class ProductosController(IProductoService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool desc = false,
        [FromQuery] int? categoryId = null,
        [FromQuery] string? category = null)
    {
        var search = new Pluxy3dBE.DomainContracts.DTOs.ProductoSearchDto
        {
            Categoria = category,
            Page = page,
            PageSize = pageSize,
            SoloActivos = true,
        };
        var result = await service.SearchProductosAsync(search);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var p = await service.GetProductoByIdAsync(id);
        return p is null ? NotFound() : Ok(p);
    }
}
