using Microsoft.AspNetCore.Mvc;

namespace Pluxy3dBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdenesController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetOrdenes()
        {
            // Mock: Devuelve una lista de órdenes de ejemplo
            return Ok(new[] {
                new { Id = 1, Fecha = "2025-05-20", Total = 300 },
                new { Id = 2, Fecha = "2025-05-19", Total = 150 }
            });
        }
    }
}
