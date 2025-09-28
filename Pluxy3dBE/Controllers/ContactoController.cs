using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.Controllers;

[ApiController]
[Route("api/contactos")]
[Produces("application/json")]
public class ContactoController : ControllerBase
{
    private readonly IContactoService _contactoService;
    private readonly ILogger<ContactoController> _logger;

    public ContactoController(IContactoService contactoService, ILogger<ContactoController> logger)
    {
        _contactoService = contactoService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> CreateContacto([FromBody] CreateMensajeDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid contact creation request");
                return BadRequest(ModelState);
            }

            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
            _logger.LogInformation("Contact creation from IP: {IpAddress}", ipAddress);

            var id = await _contactoService.CreateAsync(dto);
            _logger.LogInformation("Contact created with ID: {ContactId}", id);
            
            return CreatedAtAction(nameof(GetContacto), new { id }, new { contactId = id });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating contact");
            return BadRequest(new { error = "Error al crear contacto" });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetContactos()
    {
        try
        {
            var contacts = await _contactoService.GetAllAsync();
            return Ok(contacts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving contacts");
            return BadRequest(new { error = "Error al obtener contactos" });
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetContacto(int id)
    {
        try
        {
            var contacts = await _contactoService.GetAllAsync();
            var contact = contacts.FirstOrDefault(c => c.Id == id);

            if (contact == null)
            {
                return NotFound(new { error = "Contacto no encontrado" });
            }

            return Ok(contact);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting contact {ContactId}", id);
            return BadRequest(new { error = "Error al obtener contacto" });
        }
    }

    [HttpPatch]
    public async Task<IActionResult> Patch([FromBody] PatchReadDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var success = await _contactoService.PatchReadAsync(dto);
        if (!success) return NotFound();
        return Ok(new { ok = true });
    }

    [HttpDelete]
    public async Task<IActionResult> Delete([FromQuery] DeleteIdDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var success = await _contactoService.DeleteAsync(dto.Id);
        if (!success) return NotFound(new { error = "No encontrado" });
        return Ok(new { ok = true });
    }
}
