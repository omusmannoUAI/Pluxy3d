using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DomainContracts.DTOs;

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
        var file = await users.ExportCsvAsync(q, status);
        return File(file.Bytes, file.ContentType, file.FileName);
    }
}
 
