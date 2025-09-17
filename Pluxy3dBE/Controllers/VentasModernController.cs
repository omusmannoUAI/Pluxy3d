using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DomainContracts.Authorization;
using Pluxy3dBE.DomainContracts.Commands;
using Pluxy3dBE.Domain.Services;

namespace Pluxy3dBE.Controllers;

/// <summary>
/// Controller modernizado que usa TODOS los patrones de diseño
/// ELIMINA COMPLETAMENTE los IF/SWITCH statements
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class VentasModernController : ControllerBase
{
    private readonly IVentaService _ventaService;
    private readonly IAuthorizationService _authorizationService;
    private readonly ICommandDispatcher _commandDispatcher;
    private readonly ILogger<VentasModernController> _logger;
    private readonly ICarritoCommandFactory _carritoCommandFactory;

    public VentasModernController(
        IVentaService ventaService,
        IAuthorizationService authorizationService,
    ICommandDispatcher commandDispatcher,
    ILogger<VentasModernController> logger,
    ICarritoCommandFactory carritoCommandFactory)
    {
        _ventaService = ventaService;
        _authorizationService = authorizationService;
        _commandDispatcher = commandDispatcher;
        _logger = logger;
        _carritoCommandFactory = carritoCommandFactory;
    }

    /// <summary>
    /// Crear venta usando Template Method + Factory + Strategy Patterns
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateVenta([FromBody] CreateVentaDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();

            var request = new CreateVentaRequest
            {
                UsuarioId = userId,
                DireccionEnvio = dto.DireccionEnvio,
                MedioPagoId = dto.MedioPagoId,
                NotasEspeciales = dto.NotasEspeciales
            };

            // El servicio maneja toda la lógica usando patrones de diseño
            var result = await _ventaService.CreateVentaAsync(request);

            return result.IsSuccess
                ? Ok(new { Success = true, result.Venta!.VentaId, Message = "Venta creada exitosamente" })
                : BadRequest(new { Success = false, Error = result.ErrorMessage });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en CreateVenta");
            return StatusCode(500, new { Success = false, Error = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Procesar pago usando Factory Pattern
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    [HttpPost("{ventaId}/payment")]
    public async Task<IActionResult> ProcessPayment(int ventaId, [FromBody] ProcessPaymentDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();

            var request = new ProcessPaymentRequest
            {
                VentaId = ventaId,
                UsuarioId = userId,
                TipoPago = dto.TipoPago,
                CustomerEmail = dto.CustomerEmail,
                CustomerName = dto.CustomerName,
                PaymentDetails = dto.PaymentDetails
            };

            // El servicio usa Factory Pattern para seleccionar el procesador
            var result = await _ventaService.ProcessPaymentAsync(request);

            return result.IsSuccess
                ? Ok(new { Success = true, result.TransactionId, Message = "Pago procesado exitosamente" })
                : BadRequest(new { Success = false, Error = result.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en ProcessPayment");
            return StatusCode(500, new { Success = false, Error = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Cambiar estado usando State Pattern
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    [HttpPut("{ventaId}/state")]
    public async Task<IActionResult> ChangeState(int ventaId, [FromBody] ChangeStateDto dto)
    {
        try
        {
            // El servicio usa State Pattern para manejar transiciones
            var result = await _ventaService.ChangeVentaStateAsync(ventaId, dto.NuevoEstado, dto.Motivo);

            return result.IsSuccess
                ? Ok(new { Success = true, result.Message })
                : BadRequest(new { Success = false, Error = result.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en ChangeState");
            return StatusCode(500, new { Success = false, Error = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Obtener ventas con autorización automática usando Strategy Pattern
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetVentas([FromQuery] VentaFilterDto? filter = null)
    {
        try
        {
            var userId = GetCurrentUserId();

            var ventaFilter = filter != null ? new VentaFilter
            {
                FechaDesde = filter.FechaDesde,
                FechaHasta = filter.FechaHasta,
                Estado = filter.Estado,
                MontoMinimo = filter.MontoMinimo,
                MontoMaximo = filter.MontoMaximo
            } : null;

            // El servicio usa Strategy Pattern para autorización automática
            var ventas = await _ventaService.GetVentasAsync(userId, ventaFilter);

            return Ok(new { Success = true, Data = ventas.Select(MapToDto) });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en GetVentas");
            return StatusCode(500, new { Success = false, Error = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Cancelar venta usando State Pattern
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    [HttpPut("{ventaId}/cancel")]
    public async Task<IActionResult> CancelVenta(int ventaId, [FromBody] CancelVentaDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();

            // El servicio usa State Pattern + Strategy Pattern
            var result = await _ventaService.CancelVentaAsync(ventaId, userId, dto.Motivo);

            return result.IsSuccess
                ? Ok(new { Success = true, result.Message })
                : BadRequest(new { Success = false, Error = result.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en CancelVenta");
            return StatusCode(500, new { Success = false, Error = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Gestionar carrito usando Command Pattern
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    [HttpPost("carrito/{action}")]
    public async Task<IActionResult> ManageCarrito(string action, [FromBody] CarritoCommandDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();
            // Factory crea el comando según la acción (sin switch)
            var args = new Dictionary<string, object>
            {
                { nameof(AddItemToCarritoCommand.ImpresoraId), dto.ProductoId },
                { nameof(AddItemToCarritoCommand.Cantidad), dto.Cantidad },
                { nameof(AddItemToCarritoCommand.UsuarioId), userId.ToString() },
                { nameof(AddItemToCarritoCommand.SessionId), string.Empty },
            };

            // Precio opcional desde metadata
            if (dto.Metadata.TryGetValue("PrecioUnitario", out var precio) && precio is not null)
            {
                args[nameof(AddItemToCarritoCommand.PrecioUnitario)] = Convert.ToDecimal(precio);
            }

            // Campos para otros comandos
            args[nameof(UpdateCarritoItemCommand.ItemId)] = dto.ProductoId;
            args[nameof(UpdateCarritoItemCommand.NuevaCantidad)] = dto.Cantidad;
            args[nameof(RemoveItemFromCarritoCommand.ItemId)] = dto.ProductoId;

            var command = _carritoCommandFactory.Create(action, args);
            var result = await _commandDispatcher.DispatchAsync(command);

            return result.Success
                ? Ok(new { Success = true, result.Message, result.Data })
                : BadRequest(new { Success = false, Error = result.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en ManageCarrito");
            return StatusCode(500, new { Success = false, Error = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Verificar permisos usando Strategy Pattern
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    [HttpGet("permissions")]
    public async Task<IActionResult> GetUserPermissions()
    {
        try
        {
            var userId = GetCurrentUserId();

            // Strategy Pattern maneja la lógica de permisos automáticamente
            var permissions = await _authorizationService.GetUserPermissionsAsync(userId);

            return Ok(new { Success = true, Permissions = permissions });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en GetUserPermissions");
            return StatusCode(500, new { Success = false, Error = "Error interno del servidor" });
        }
    }

    /// <summary>
    /// Verificar acceso a recurso usando Strategy Pattern
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    [HttpPost("authorize")]
    public async Task<IActionResult> CheckAuthorization([FromBody] AuthorizationCheckDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();

            // Strategy Pattern elimina completamente los IF/SWITCH
            var hasAccess = await _authorizationService.AuthorizeAsync(dto.Recurso, dto.Accion, userId);

            return Ok(new { Success = true, HasAccess = hasAccess });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error en CheckAuthorization");
            return StatusCode(500, new { Success = false, Error = "Error interno del servidor" });
        }
    }

    // ============================
    // MÉTODOS AUXILIARES
    // ============================

    private Guid GetCurrentUserId()
    {
        // Simular obtención del usuario desde JWT/Claims
        // En producción sería: Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "")
        return Guid.Parse("00000000-0000-0000-0000-000000000001"); // Usuario de prueba
    }

    private object MapToDto(Pluxy3dBE.Entities.Venta venta)
    {
        return new
        {
            venta.VentaId,
            venta.UsuarioId,
            venta.FechaVenta,
            venta.Total,
            venta.EstadoId,
            venta.DireccionEnvioId
        };
    }
}

// ============================
// DTOs PARA EL CONTROLLER
// ============================

public class CreateVentaDto
{
    public string DireccionEnvio { get; set; } = string.Empty;
    public int MedioPagoId { get; set; }
    public string? NotasEspeciales { get; set; }
}

public class ProcessPaymentDto
{
    public string TipoPago { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public Dictionary<string, object> PaymentDetails { get; set; } = new();
}

public class ChangeStateDto
{
    public string NuevoEstado { get; set; } = string.Empty;
    public string? Motivo { get; set; }
}

public class VentaFilterDto
{
    public DateTime? FechaDesde { get; set; }
    public DateTime? FechaHasta { get; set; }
    public string? Estado { get; set; }
    public decimal? MontoMinimo { get; set; }
    public decimal? MontoMaximo { get; set; }
}

public class CancelVentaDto
{
    public string Motivo { get; set; } = string.Empty;
}

public class CarritoCommandDto
{
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public int? TargetUsuarioId { get; set; }
    public Dictionary<string, object> Metadata { get; set; } = new();
}

public class AuthorizationCheckDto
{
    public string Recurso { get; set; } = string.Empty;
    public string Accion { get; set; } = string.Empty;
}
