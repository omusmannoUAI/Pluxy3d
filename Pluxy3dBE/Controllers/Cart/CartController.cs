using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.Controllers.Cart;

[ApiController]
[Route("api/carrito")]
public class CarritoController(ICarritoService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? usuarioId = null, [FromQuery] string? sessionId = null)
        => Ok(await service.GetCarritoAsync(usuarioId, sessionId));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var carrito = await service.GetCarritoAsync(null, null);
        var item = carrito.Items.FirstOrDefault(i => i.Id == id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] AddCarritoItemDto dto)
    {
        var created = await service.AddItemToCarritoAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] int quantity)
    {
        var ok = await service.UpdateItemCantidadAsync(new UpdateCarritoItemDto { ItemId = id, NuevaCantidad = quantity });
        return Ok(ok);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await service.RemoveItemFromCarritoAsync(id);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> Clear([FromQuery] string? usuarioId = null, [FromQuery] string? sessionId = null)
    {
        var ok = await service.ClearCarritoAsync(usuarioId, sessionId);
        return ok ? NoContent() : NotFound();
    }
}
