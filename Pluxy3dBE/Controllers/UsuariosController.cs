using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/usuarios")]
public class UsuariosController : ControllerBase
{
    private readonly IUsersService _users;

    public UsuariosController(IUsersService users)
    {
        _users = users;
    }
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
        var result = await _users.GetUsersAsync(q, status, page, pageSize);
        return Ok(new { items = result.Items, total = result.TotalCount, page = result.Page, pageSize = result.PageSize });
    }

    /// <summary>
    /// Obtiene un usuario por id
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var u = await _users.GetByIdAsync(id);
        return u is null ? NotFound() : Ok(u);
    }

    [HttpGet("export")]
    public async Task<IActionResult> Export(
        [FromQuery] string? q = null,
        [FromQuery] string? status = "todos")
    {
        var file = await _users.ExportCsvAsync(q, status);
        if (file == null || file.Bytes == null || string.IsNullOrEmpty(file.ContentType) || string.IsNullOrEmpty(file.FileName))
        {
            return NoContent();
        }

        return File(file.Bytes, file.ContentType, file.FileName);
    }
}

