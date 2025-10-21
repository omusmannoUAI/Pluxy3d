using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.New.Controllers;

[ApiController]
[Route("api/carrito")]
public class CarritoController : ControllerBase
{
    private readonly ICarritoService _service;

    public CarritoController(ICarritoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var items = await _service.GetCarritoAsync();
        return Ok(items);
    }

    [HttpPost]
    public async Task<IActionResult> Add([FromBody] AddCarritoItemDto item)
    {
        if (item == null) return BadRequest();
        await _service.AddItemAsync(item);
        return CreatedAtAction(nameof(GetAll), null);
    }
}
