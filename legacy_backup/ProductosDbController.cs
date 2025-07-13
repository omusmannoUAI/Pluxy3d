using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.Data;
using Pluxy3dBE.Models;

namespace Pluxy3dBE.Controllers;

/// <summary>
/// Controlador para gestión de productos usando entidades de la base de datos real
/// </summary>
[ApiController]
[Route("api/v3/[controller]")]
[Produces("application/json")]
public class ProductosDbController : ControllerBase
{
    private readonly AppDbContextFromDb _context;
    private readonly ILogger<ProductosDbController> _logger;

    public ProductosDbController(AppDbContextFromDb context, ILogger<ProductosDbController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Obtiene todos los productos de la base de datos
    /// </summary>
    /// <returns>Lista de productos</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
    {
        try
        {
            _logger.LogInformation("Obteniendo productos desde la base de datos");
            var productos = await _context.Productos
                .Include(p => p.Categoria)
                .Where(p => p.Visible == true)
                .ToListAsync();
            
            return Ok(productos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener productos");
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtiene un producto por su ID
    /// </summary>
    /// <param name="id">ID del producto</param>
    /// <returns>Producto encontrado</returns>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Producto>> GetProducto(int id)
    {
        try
        {
            _logger.LogInformation("Obteniendo producto con ID: {ProductoId}", id);
            
            var producto = await _context.Productos
                .Include(p => p.Categoria)
                .FirstOrDefaultAsync(p => p.ProductoId == id);
            
            if (producto == null)
            {
                return NotFound(new { message = "Producto no encontrado" });
            }

            return Ok(producto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener producto con ID: {ProductoId}", id);
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtiene productos por categoría
    /// </summary>
    /// <param name="categoriaId">ID de la categoría</param>
    /// <returns>Lista de productos</returns>
    [HttpGet("categoria/{categoriaId:int}")]
    public async Task<ActionResult<IEnumerable<Producto>>> GetProductosPorCategoria(int categoriaId)
    {
        try
        {
            var productos = await _context.Productos
                .Include(p => p.Categoria)
                .Where(p => p.CategoriaId == categoriaId && p.Visible == true)
                .ToListAsync();
            
            return Ok(productos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener productos por categoría: {CategoriaId}", categoriaId);
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Obtiene todas las categorías
    /// </summary>
    /// <returns>Lista de categorías</returns>
    [HttpGet("categorias")]
    public async Task<ActionResult<IEnumerable<CategoriasProducto>>> GetCategorias()
    {
        try
        {
            var categorias = await _context.CategoriasProductos.ToListAsync();
            return Ok(categorias);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener categorías");
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Crea un nuevo producto
    /// </summary>
    /// <param name="producto">Datos del producto</param>
    /// <returns>Producto creado</returns>
    [HttpPost]
    public async Task<ActionResult<Producto>> CreateProducto([FromBody] Producto producto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Productos.Add(producto);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProducto), new { id = producto.ProductoId }, producto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear producto");
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Actualiza un producto existente
    /// </summary>
    /// <param name="id">ID del producto</param>
    /// <param name="producto">Datos actualizados</param>
    /// <returns>Producto actualizado</returns>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<Producto>> UpdateProducto(int id, [FromBody] Producto producto)
    {
        try
        {
            if (id != producto.ProductoId)
            {
                return BadRequest(new { message = "ID del producto no coincide" });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(producto).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(producto);
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await ProductoExists(id))
            {
                return NotFound();
            }
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar producto con ID: {ProductoId}", id);
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    /// <summary>
    /// Elimina un producto
    /// </summary>
    /// <param name="id">ID del producto</param>
    /// <returns>Confirmación de eliminación</returns>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProducto(int id)
    {
        try
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar producto con ID: {ProductoId}", id);
            return StatusCode(500, new { message = "Error interno del servidor", error = ex.Message });
        }
    }

    private async Task<bool> ProductoExists(int id)
    {
        return await _context.Productos.AnyAsync(e => e.ProductoId == id);
    }
}
