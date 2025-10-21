using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.New.Controllers;

[ApiController]
[Route("api/contacto")]
public class ContactoController : ControllerBase
{
    private readonly IContactoService _service;

    public ContactoController(IContactoService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] CreateMensajeDto dto)
    {
        if (dto == null) return BadRequest();
        await _service.CreateMensajeAsync(dto);
        return Accepted();
    }
}
