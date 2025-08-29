using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.Repository.Data;
using System.Text.RegularExpressions;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/categorias")]
public class CategoriasController(AppDbContextFromDb db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var cats = await db.CategoriasProductos
            .AsNoTracking()
            .Select(c => new {
                id = c.CategoriaId,
                name = c.Nombre,
                slug = Slugify(c.Nombre ?? string.Empty),
                description = c.Descripcion,
                count = c.Productos.Count
            })
            .ToListAsync();
        return Ok(cats);
    }

    private static string Slugify(string text)
    {
        text = text.ToLowerInvariant();
    text = Regex.Replace(text, @"[^a-z0-9\u00f1\u00e1\u00e9\u00ed\u00f3\u00fa\s-]", ""); // keep basic accents
    text = Regex.Replace(text, "[\\s_-]+", "-");
        text = Regex.Replace(text, "^-+|-+$", "");
        return text;
    }
}
