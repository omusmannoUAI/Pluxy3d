using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DomainContracts.DTOs;
using System.Text;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/usuarios")]
public class UsuariosController(IUsersService users) : ControllerBase
{
    /// <summary>
    /// Obtiene la lista de usuarios (paginada)
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetUsers(
        [FromQuery] string? q = null,
        [FromQuery] string? status = "todos",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        if (page < 1) page = 1;
        if (pageSize <= 0 || pageSize > 500) pageSize = 50;
        var result = await users.GetUsersAsync(q, status, page, pageSize);
        return Ok(new { items = result.Items, total = result.TotalCount, page = result.Page, pageSize = result.PageSize });
    }

    /// <summary>
    /// Obtiene un usuario por id
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var u = await users.GetByIdAsync(id);
        return u is null ? NotFound() : Ok(u);
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export(
        [FromQuery] string? q = null,
        [FromQuery] string? status = "todos")
    {
        var result = await users.GetUsersAsync(q, status, 1, int.MaxValue);
    var items = result.Items;

        var sb = new StringBuilder();
    sb.AppendLine("Id,Nombre,Email,Activo,Rol,Pedidos,TotalGastado,Since,UltimoAcceso");
    foreach (var u in items)
        {
            sb.AppendLine(string.Join(',',
        0,
        Escape(u.Nombre),
        Escape(u.Email),
        u.Activo ? "Activo" : "Inactivo",
        "customer",
        0,
        "$0",
        Escape(u.FechaRegistro.ToString("yyyy-MM-dd")),
        string.Empty
            ));
        }

        var bytes = Encoding.UTF8.GetBytes(sb.ToString());
        var fileName = $"usuarios_{DateTime.UtcNow:yyyyMMdd}.csv";
        return File(bytes, "text/csv; charset=utf-8", fileName);
    }

    private static string Escape(string? s)
    {
        s ??= string.Empty;
        if (s.Contains('"') || s.Contains(',') || s.Contains('\n'))
        {
            s = '"' + s.Replace("\"", "\"\"") + '"';
        }
        return s;
    }
}
 
