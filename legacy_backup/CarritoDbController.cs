using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.Data;
using Pluxy3dBE.Models;

namespace Pluxy3dBE.Controllers;

/// <summary>
/// Controlador para gestión del carrito usando entidades de la base de datos real
/// </summary>
[ApiController]
[Route("api/v3/[controller]")]
[Produces("application/json")]
public class CarritoDbController : ControllerBase
{
    private readonly AppDbContextFromDb _context;
    private readonly ILogger<CarritoDbController> _logger;

    public CarritoDbController(AppDbContextFromDb context, ILogger<CarritoDbController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todos los items del carrito
    /// </summary>
    /// <returns>Lista de items del carrito</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CarritoItem>>> GetCarritoItems()
    {
        try
        {
            var items = await _context.CarritoItems
                .Include(ci => ci.Carrito)
                .Include(ci => ci.Impresora)
                .ToListAsync();

            return Ok(items);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener items del carrito");
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtiene un item del carrito por su ID
    /// </summary>
    /// <param name="id">ID del item</param>
    /// <returns>Item del carrito</returns>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CarritoItem>> GetCarritoItem(int id)
    {
        try
        {
            var item = await _context.CarritoItems
                .Include(ci => ci.Carrito)
                .Include(ci => ci.Impresora)
                .FirstOrDefaultAsync(ci => ci.ItemId == id);

            if (item == null)
            {
                return NotFound(new { message = "Item del carrito no encontrado" });
            }

            return Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener item del carrito con ID: {ItemId}", id);
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Agrega un item al carrito
    /// </summary>
    /// <param name="carritoItem">Datos del item</param>
    /// <returns>Item creado</returns>
    [HttpPost]
    public async Task<ActionResult<CarritoItem>> AddCarritoItem([FromBody] CarritoItem carritoItem)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.CarritoItems.Add(carritoItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCarritoItem), new { id = carritoItem.ItemId }, carritoItem);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al agregar item al carrito");
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Actualiza la cantidad de un item del carrito
    /// </summary>
    /// <param name="id">ID del item</param>
    /// <param name="nuevaCantidad">Nueva cantidad</param>
    /// <returns>Item actualizado</returns>
    [HttpPut("{id:int}/cantidad/{nuevaCantidad:int}")]
    public async Task<ActionResult<CarritoItem>> UpdateCantidad(int id, int nuevaCantidad)
    {
        try
        {
            var item = await _context.CarritoItems.FindAsync(id);
            if (item == null)
            {
                return NotFound(new { message = "Item del carrito no encontrado" });
            }

            item.Cantidad = nuevaCantidad;
            await _context.SaveChangesAsync();

            return Ok(item);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar cantidad del item: {ItemId}", id);
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Elimina un item del carrito
    /// </summary>
    /// <param name="id">ID del item</param>
    /// <returns>Confirmación de eliminación</returns>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCarritoItem(int id)
    {
        try
        {
            var item = await _context.CarritoItems.FindAsync(id);
            if (item == null)
            {
                return NotFound(new { message = "Item del carrito no encontrado" });
            }

            _context.CarritoItems.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar item del carrito: {ItemId}", id);
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Limpia todos los items del carrito
    /// </summary>
    /// <returns>Confirmación de limpieza</returns>
    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCarrito()
    {
        try
        {
            var items = await _context.CarritoItems.ToListAsync();
            _context.CarritoItems.RemoveRange(items);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al limpiar el carrito");
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }
}
