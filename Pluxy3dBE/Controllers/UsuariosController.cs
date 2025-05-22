using Microsoft.AspNetCore.Mvc;

namespace Pluxy3dBE.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetPerfil()
        {
            // Mock: Devuelve un usuario de ejemplo
            return Ok(new { Id = 1, Nombre = "Usuario Demo", Email = "demo@demo.com" });
        }
    }
}
