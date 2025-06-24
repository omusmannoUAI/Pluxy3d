using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.Data;
using Pluxy3dBE.Models;
using System.Linq;

namespace Pluxy3dBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SeedController(AppDbContext context)
        {
            _context = context;
        }        [HttpPost("productos")]
        public async Task<IActionResult> SeedProductos()
        {
            try
            {
                // Clear existing cart items first to avoid foreign key issues
                var existingCartItems = _context.CarritoItems.ToList();
                if (existingCartItems.Any())
                {
                    _context.CarritoItems.RemoveRange(existingCartItems);
                    await _context.SaveChangesAsync();
                }

                // Clear existing products
                var existingProducts = _context.Productos.ToList();
                if (existingProducts.Any())
                {
                    _context.Productos.RemoveRange(existingProducts);
                    await _context.SaveChangesAsync();
                }

                var productos = new List<Producto>
                {
                    // Impresoras 3D populares
                    new Producto
                    {
                        Nombre = "Impresora 3D Creality Ender 3 V2",
                        Descripcion = "Impresora 3D FDM con cama de vidrio, extrusor mejorado y estructura de aluminio. Ideal para principiantes y profesionales.",
                        Precio = 295000,
                        Image = "/ender3v2.webp",
                        Categoria = "impresora",
                        Marca = "Creality"
                    },
                    new Producto
                    {
                        Nombre = "Impresora 3D Creality Ender 3 Pro",
                        Descripcion = "Versión mejorada de la Ender 3 con fuente de alimentación externa y base magnética flexible.",
                        Precio = 275000,
                        Image = "/placeholder.svg",
                        Categoria = "impresora",
                        Marca = "Creality"
                    },
                    new Producto
                    {
                        Nombre = "Impresora 3D Artillery Sidewinder X1",
                        Descripcion = "Impresora 3D de gran formato con pantalla táctil, nivelación automática y extrusor directo.",
                        Precio = 420000,
                        Image = "/placeholder.svg",
                        Categoria = "impresora",
                        Marca = "Artillery"
                    },
                    new Producto
                    {
                        Nombre = "Impresora 3D Anycubic Kobra 2",
                        Descripcion = "Impresora 3D con nivelación automática 25 puntos y velocidad de impresión hasta 250mm/s.",
                        Precio = 320000,
                        Image = "/placeholder.svg",
                        Categoria = "impresora",
                        Marca = "Anycubic"
                    },

                    // Componentes y mejoras
                    new Producto
                    {
                        Nombre = "Kit Mejora Ender 3 - Extrusor Todo Metal",
                        Descripcion = "Kit completo de mejora para Ender 3 con extrusor todo metal, tubos PTFE y resortes mejorados.",
                        Precio = 45000,
                        Image = "/kitmejora.webp",
                        Categoria = "componente",
                        Marca = "Creality"
                    },
                    new Producto
                    {
                        Nombre = "Sistema Doble Tracción Z Ender 3",
                        Descripcion = "Kit de doble motor Z para eliminar el desalineamiento y mejorar la precisión vertical.",
                        Precio = 38000,
                        Image = "/doble.webp",
                        Categoria = "componente",
                        Marca = "Creality"
                    },
                    new Producto
                    {
                        Nombre = "Hotend V6 Todo Metal",
                        Descripcion = "Hotend de alta temperatura hasta 300°C para filamentos técnicos como ABS, PETG y Nylon.",
                        Precio = 28000,
                        Image = "/placeholder.svg",
                        Categoria = "componente",
                        Marca = "E3D"
                    },
                    new Producto
                    {
                        Nombre = "Placa PEI Magnética Flexible",
                        Descripcion = "Superficie de impresión PEI magnética que se flexiona para remover piezas fácilmente.",
                        Precio = 15000,
                        Image = "/placeholder.svg",
                        Categoria = "componente",
                        Marca = "Genérico"
                    },

                    // Filamentos
                    new Producto
                    {
                        Nombre = "Filamento PLA+ 1.75mm 1kg - Blanco",
                        Descripcion = "Filamento PLA+ de alta calidad, fácil impresión y acabado mate. Ideal para principiantes.",
                        Precio = 8500,
                        Image = "/placeholder.svg",
                        Categoria = "filamento",
                        Marca = "SUNLU"
                    },
                    new Producto
                    {
                        Nombre = "Filamento ABS 1.75mm 1kg - Negro",
                        Descripcion = "Filamento ABS resistente al calor y impacto. Ideal para piezas funcionales.",
                        Precio = 9500,
                        Image = "/placeholder.svg",
                        Categoria = "filamento",
                        Marca = "SUNLU"
                    },
                    new Producto
                    {
                        Nombre = "Filamento PETG 1.75mm 1kg - Transparente",
                        Descripcion = "Filamento PETG con claridad cristalina, resistencia química y facilidad de impresión.",
                        Precio = 12000,
                        Image = "/placeholder.svg",
                        Categoria = "filamento",
                        Marca = "SUNLU"
                    },

                    // Herramientas y accesorios
                    new Producto
                    {
                        Nombre = "Kit Herramientas Impresora 3D",
                        Descripcion = "Set completo con espátulas, alicates, agujas de limpieza y llaves hexagonales.",
                        Precio = 6500,
                        Image = "/placeholder.svg",
                        Categoria = "accesorio",
                        Marca = "Genérico"
                    },
                    new Producto
                    {
                        Nombre = "Boquillas 0.4mm Pack x10",
                        Descripcion = "Set de 10 boquillas de latón 0.4mm compatibles con hotend MK8.",
                        Precio = 4500,
                        Image = "/placeholder.svg",
                        Categoria = "accesorio",
                        Marca = "Genérico"
                    },
                    new Producto
                    {
                        Nombre = "Sensor Nivelación Automática BLTouch",
                        Descripcion = "Sensor de nivelación automática de alta precisión compatible con la mayoría de impresoras.",
                        Precio = 35000,
                        Image = "/placeholder.svg",
                        Categoria = "accesorio",
                        Marca = "Antclabs"
                    }
                };

                _context.Productos.AddRange(productos);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Base de datos poblada exitosamente", 
                    count = productos.Count 
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    message = "Error al poblar la base de datos", 
                    error = ex.Message 
                });
            }
        }        [HttpPost("clear")]
        public async Task<IActionResult> ClearDatabase()
        {
            try
            {
                // Clear cart items first (foreign key constraint)
                var cartItems = _context.CarritoItems.ToList();
                if (cartItems.Any())
                {
                    _context.CarritoItems.RemoveRange(cartItems);
                    await _context.SaveChangesAsync();
                }
                
                // Then clear products
                var products = _context.Productos.ToList();
                if (products.Any())
                {
                    _context.Productos.RemoveRange(products);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { message = "Base de datos limpiada exitosamente" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    message = "Error al limpiar la base de datos", 
                    error = ex.Message 
                });
            }
        }[HttpGet("stats")]
        public IActionResult GetStats()
        {
            try
            {
                var productCount = _context.Productos.Count();
                var cartItemCount = _context.CarritoItems.Count();

                var productsByCategory = _context.Productos
                    .GroupBy(p => p.Categoria)
                    .Select(g => new { Categoria = g.Key, Count = g.Count() })
                    .ToList();

                return Ok(new { 
                    productos = productCount,
                    itemsCarrito = cartItemCount,
                    categorias = productsByCategory
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { 
                    message = "Error al obtener estadísticas", 
                    error = ex.Message 
                });
            }
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "SeedController está funcionando correctamente" });
        }
    }
}
