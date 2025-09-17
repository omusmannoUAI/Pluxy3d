using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.RateLimiting;
using Pluxy3dBE.Repository.Data;
using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/contacto")]
public class ContactoController : ControllerBase
{
    private readonly Pluxy3dBE.DomainContracts.Services.IContactoService _contactoService;

    public ContactoController(Pluxy3dBE.DomainContracts.Services.IContactoService contactoService)
    {
        _contactoService = contactoService;
    }

    [HttpPost]
    [EnableRateLimiting("contacto-write")]
    public async Task<IActionResult> Post([FromBody] Pluxy3dBE.DomainContracts.DTOs.CreateMensajeDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre) || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Mensaje))
            return BadRequest(new { error = "Campos requeridos" });

        var id = await _contactoService.CreateAsync(dto);
        return CreatedAtAction(nameof(Get), new { id }, new { ok = true });
    }

    [HttpGet]
    [EnableRateLimiting("contacto-read")]
    public async Task<IActionResult> Get()
    {
        var list = await _contactoService.GetAllAsync();
        return Ok(list);
    }

    [HttpPatch]
    [EnableRateLimiting("contacto-write")]
    public async Task<IActionResult> Patch([FromBody] Pluxy3dBE.DomainContracts.DTOs.PatchReadDto dto)
    {
        if (dto.Id <= 0) return BadRequest(new { error = "id requerido" });
        var success = await _contactoService.PatchReadAsync(dto);
        if (!success) return NotFound();
        return Ok(new { ok = true });
    }

    [HttpDelete]
    [EnableRateLimiting("contacto-write")]
    public async Task<IActionResult> Delete([FromQuery] int id)
    {
        if (id <= 0) return BadRequest(new { error = "id requerido" });
        var success = await _contactoService.DeleteAsync(id);
        if (!success) return NotFound(new { error = "No encontrado" });
        return Ok(new { ok = true });
    }
}
