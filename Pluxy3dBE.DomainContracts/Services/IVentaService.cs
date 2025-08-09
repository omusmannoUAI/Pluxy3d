using Pluxy3dBE.Entities;
using Pluxy3dBE.DomainContracts.Payment;

namespace Pluxy3dBE.DomainContracts.Services;

/// <summary>
/// Contrato para el servicio de ventas modernizado con patrones de diseño
/// </summary>
public interface IVentaService
{
    /// <summary>
    /// Crear venta usando Template Method Pattern
    /// </summary>
    Task<VentaResult> CreateVentaAsync(CreateVentaRequest request);

    /// <summary>
    /// Procesar pago usando Factory Pattern
    /// </summary>
    Task<PaymentResult> ProcessPaymentAsync(ProcessPaymentRequest request);

    /// <summary>
    /// Cambiar estado usando State Pattern
    /// </summary>
    Task<StateChangeResult> ChangeVentaStateAsync(int ventaId, string nuevoEstado, string? motivo = null);

    /// <summary>
    /// Obtener ventas con autorización automática
    /// </summary>
    Task<IEnumerable<Venta>> GetVentasAsync(Guid usuarioId, VentaFilter? filter = null);

    /// <summary>
    /// Cancelar venta usando State Pattern
    /// </summary>
    Task<StateChangeResult> CancelVentaAsync(int ventaId, Guid usuarioId, string motivo);
}

// ============================
// DTOs Y RESULT OBJECTS
// ============================

public class CreateVentaRequest
{
    public Guid UsuarioId { get; set; }
    public string DireccionEnvio { get; set; } = string.Empty;
    public int MedioPagoId { get; set; }
    public string? NotasEspeciales { get; set; }
}

public class ProcessPaymentRequest
{
    public int VentaId { get; set; }
    public Guid UsuarioId { get; set; }
    public string TipoPago { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public Dictionary<string, object> PaymentDetails { get; set; } = new();
}

public class VentaFilter
{
    public DateTime? FechaDesde { get; set; }
    public DateTime? FechaHasta { get; set; }
    public string? Estado { get; set; }
    public decimal? MontoMinimo { get; set; }
    public decimal? MontoMaximo { get; set; }
}

public class VentaResult
{
    public bool IsSuccess { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public Venta? Venta { get; set; }

    public static VentaResult Success(Venta venta) => new() { IsSuccess = true, Venta = venta };
    public static VentaResult Failure(string error) => new() { IsSuccess = false, ErrorMessage = error };
}

public class StateChangeResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;

    public static StateChangeResult Success(string message) => new() { IsSuccess = true, Message = message };
    public static StateChangeResult Failure(string message) => new() { IsSuccess = false, Message = message };
}
