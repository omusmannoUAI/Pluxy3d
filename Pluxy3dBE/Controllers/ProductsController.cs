using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;
using System.Security.Cryptography;
using System.Text;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/productos")]
public class ProductosController(IProductoService service) : ControllerBase
{
    // Simple brand inference without DB schema changes
    private static readonly string[] KnownBrands = new[]
    {
        "Creality", "Hellbot", "Prusa", "Anycubic", "Artillery", "Elegoo", "Bambu Lab", "Flashforge"
    };

    private static string? InferBrand(Pluxy3dBE.Entities.Producto p)
    {
        var source = $"{p.Nombre} {p.Descripcion}".ToLowerInvariant();
        foreach (var b in KnownBrands)
        {
            if (source.Contains(b.ToLowerInvariant()))
                return b;
        }
        return null;
    }

    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? sortBy = null,
        [FromQuery] bool desc = false,
        [FromQuery] int? categoryId = null,
        [FromQuery] string? category = null)
    {
        // Build a search DTO and delegate to domain service
        var search = new Pluxy3dBE.DomainContracts.DTOs.ProductoSearchDto
        {
            Categoria = category,
            Page = page,
            PageSize = pageSize,
            SoloActivos = true,
        };
        var result = await service.SearchProductosAsync(search);
        var dto = result.Items.Select(p => new {
            id = p.Id,
            name = p.Nombre,
            description = p.Descripcion,
            price = p.Precio,
            image = p.Image,
            category = p.Categoria,
            brand = p.Marca
        }).ToArray();

        // Add pagination headers
    Response.Headers["X-Total-Count"] = result.TotalCount.ToString();
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
        var p = await service.GetProductoByIdAsync(id);
        if (p is null) return NotFound();
        var dto = new {
            id = p.Id,
            name = p.Nombre,
            description = p.Descripcion,
            price = p.Precio,
            image = p.Image,
            category = p.Categoria,
            brand = p.Marca
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
    private static string Slugify(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return string.Empty;
        text = text.ToLowerInvariant();
        text = System.Text.RegularExpressions.Regex.Replace(text, @"[^a-z0-9\u00f1\u00e1\u00e9\u00ed\u00f3\u00fa\s-]", "");
        text = System.Text.RegularExpressions.Regex.Replace(text, "[\\s_-]+", "-");
        text = System.Text.RegularExpressions.Regex.Replace(text, "^-+|-+$", "");
        return text;
    }
}
