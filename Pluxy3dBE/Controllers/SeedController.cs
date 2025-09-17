using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.Repository.Data;
using Pluxy3dBE.Entities;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/seed")]
public class SeedController : ControllerBase
{
    private readonly AppDbContextFromDb _db;

    public SeedController(AppDbContextFromDb db)
    {
        _db = db;
    }

    [HttpPost("clear")]
    public async Task<IActionResult> Clear(CancellationToken ct = default)
    {
    // Remove products, carrito items and orders to ensure clean seed
    _db.Productos.RemoveRange(_db.Productos);
    _db.CarritoItems.RemoveRange(_db.CarritoItems);
    _db.DetalleVenta.RemoveRange(_db.DetalleVenta);
        await _db.SaveChangesAsync(ct);
        return NoContent();
    }

    [HttpPost("productos")]
    public async Task<IActionResult> SeedProductos(CancellationToken ct = default)
    {
        // Clear existing products first
        _db.Productos.RemoveRange(_db.Productos);

        var productos = new List<Producto>
        {
            new Producto { Nombre = "Creality Ender 3 V2", Descripcion = "Impresora 3D Creality Ender 3 V2", PrecioBase = 295000m, Stock = 10, CategoriaId = null, Visible = true, Image = "" },
            new Producto { Nombre = "Creality Ender 3 Pro", Descripcion = "Impresora 3D Creality Ender 3 Pro", PrecioBase = 275000m, Stock = 10, CategoriaId = null, Visible = true, Image = "" },
            new Producto { Nombre = "Artillery Sidewinder X1", Descripcion = "Impresora 3D Artillery Sidewinder X1", PrecioBase = 420000m, Stock = 5, CategoriaId = null, Visible = true, Image = "" },
            new Producto { Nombre = "Anycubic Kobra 2", Descripcion = "Impresora 3D Anycubic Kobra 2", PrecioBase = 320000m, Stock = 8, CategoriaId = null, Visible = true, Image = "" },
            new Producto { Nombre = "Kit Mejora Ender 3", Descripcion = "Kit de mejora para Ender 3", PrecioBase = 45000m, Stock = 20, CategoriaId = null, Visible = true, Image = "" },
            new Producto { Nombre = "PLA+ 1kg Blanco", Descripcion = "Filamento PLA+ 1kg Blanco", PrecioBase = 8500m, Stock = 50, CategoriaId = null, Visible = true, Image = "" },
            new Producto { Nombre = "Kit Herramientas", Descripcion = "Kit de herramientas para impresora 3D", PrecioBase = 6500m, Stock = 30, CategoriaId = null, Visible = true, Image = "" }
        };

        _db.Productos.AddRange(productos);
        await _db.SaveChangesAsync(ct);
        return Created("/api/productos", new { added = productos.Count });
    }

    [HttpGet("stats")]
    public IActionResult Stats()
    {
        var prodCount = _db.Productos.Count();
        var cartCount = _db.CarritoItems.Count();
        return Ok(new { productos = prodCount, carritoItems = cartCount });
    }
}
