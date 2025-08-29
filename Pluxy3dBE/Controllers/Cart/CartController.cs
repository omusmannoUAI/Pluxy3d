using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.Services.Cart;
using Pluxy3dBE.Repositories.Cart;

namespace Pluxy3dBE.Controllers.Cart;

[ApiController]
[Route("api/carrito")]
public class CarritoController(ICartService service) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await service.GetAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var item = await service.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateCartItemDto dto)
    {
        var created = await service.AddAsync(dto);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Put(int id, [FromBody] int quantity)
    {
        var updated = await service.UpdateQuantityAsync(id, quantity);
        return Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await service.DeleteAsync(id);
        return NoContent();
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> Clear()
    {
        await service.ClearAsync();
        return NoContent();
    }
}
