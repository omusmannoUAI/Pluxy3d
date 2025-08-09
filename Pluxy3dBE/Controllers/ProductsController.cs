using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.Repositories.Product;
using System.Security.Cryptography;
using System.Text;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductosController(IProductRepository repo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? sortBy = null, [FromQuery] bool desc = false)
    {
        var (items, total) = await repo.GetVisiblePagedAsync(page, pageSize, sortBy, desc);
        var dto = items.Select(p => new {
            id = p.ProductoId,
            name = p.Nombre,
            description = p.Descripcion,
            price = p.PrecioBase ?? 0m,
            image = p.Image,
            category = p.Categoria != null ? p.Categoria.Nombre : null,
            brand = (string?)null
        }).ToArray();

        // Add pagination headers
        Response.Headers["X-Total-Count"] = total.ToString();
        Response.Headers["X-Page"] = page.ToString();
        Response.Headers["X-Page-Size"] = pageSize.ToString();

        // Weak ETag based on content hash
        var payload = System.Text.Json.JsonSerializer.Serialize(dto);
        var hash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(payload)));
        var etag = $"W/\"{hash}\"";
        Response.Headers["ETag"] = etag;
        var ifNoneMatch = Request.Headers["If-None-Match"].ToString();
        if (!string.IsNullOrEmpty(ifNoneMatch) && ifNoneMatch == etag)
        {
            return StatusCode(304);
        }

        return Ok(dto);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var p = await repo.GetByIdAsync(id);
        if (p is null) return NotFound();
        var dto = new {
            id = p.ProductoId,
            name = p.Nombre,
            description = p.Descripcion,
            price = p.PrecioBase ?? 0m,
            image = p.Image,
            category = p.Categoria != null ? p.Categoria.Nombre : null,
            brand = (string?)null
        };

        var payload = System.Text.Json.JsonSerializer.Serialize(dto);
        var hash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(payload)));
        var etag = $"W/\"{hash}\"";
        Response.Headers["ETag"] = etag;
        var ifNoneMatch = Request.Headers["If-None-Match"].ToString();
        if (!string.IsNullOrEmpty(ifNoneMatch) && ifNoneMatch == etag)
        {
            return StatusCode(304);
        }

        return Ok(dto);
    }
}
