using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Pluxy3dBE.Services;
using Pluxy3dBE.DTOs;

namespace Pluxy3dBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarritoController : ControllerBase
    {
        private readonly CarritoService _carritoService;
        public CarritoController(CarritoService carritoService)
        {
            _carritoService = carritoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var cart = await _carritoService.GetAllAsync();
            return Ok(cart);
        }

        [HttpPost]
        public async Task<IActionResult> AddItem([FromBody] CartItemDto item)
        {
            var result = await _carritoService.AddItemAsync(item);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveItem(int id)
        {
            var result = await _carritoService.RemoveItemAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}