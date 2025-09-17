using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;

namespace Pluxy3dBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdenesController : ControllerBase
    {
        private readonly IVentaService _ventas;

        public OrdenesController(IVentaService ventas)
        {
            _ventas = ventas;
        }
        [HttpGet]
        public async Task<IActionResult> GetOrdenes([FromQuery] Guid usuarioId)
        {
            var list = await _ventas.GetVentasAsync(usuarioId);
            return Ok(list);
        }
    }
}
