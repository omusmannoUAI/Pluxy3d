using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.New.Controllers;

[ApiController]
[Route("api/productos")]
public class ProductosController : ControllerBase
{
    private readonly IProductoService _service;

    public ProductosController(IProductoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] ProductoSearchDto search)
    {
        var paged = await _service.SearchProductosAsync(search ?? new ProductoSearchDto());
        return Ok(paged);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var p = await _service.GetProductoByIdAsync(id);
        if (p == null) return NotFound();
        return Ok(p);
    }
}
