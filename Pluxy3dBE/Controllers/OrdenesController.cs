using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;

namespace Pluxy3dBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdenesController(IVentaService ventas) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetOrdenes([FromQuery] Guid usuarioId)
        {
            var list = await ventas.GetVentasAsync(usuarioId);
            return Ok(list);
        }
    }
}
