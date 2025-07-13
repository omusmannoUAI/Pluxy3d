namespace Pluxy3dBE.DomainContracts.DTOs;

/// <summary>
/// DTO para venta (salida desde repository hacia service)
/// </summary>
public class VentaDto
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string UsuarioNombre { get; set; } = string.Empty;
    public DateTime FechaVenta { get; set; }
    public decimal MontoTotal { get; set; }
    public int EstadoId { get; set; }
    public string EstadoNombre { get; set; } = string.Empty;
    public string? NotasEspeciales { get; set; }
    public List<DetalleVentaDto> Detalles { get; set; } = new();
    public List<PagoDto> Pagos { get; set; } = new();
}

/// <summary>
/// DTO para crear nueva venta
/// </summary>
public class CreateVentaDto
{
    public int UsuarioId { get; set; }
    public decimal MontoTotal { get; set; }
    public int EstadoId { get; set; }
    public string? NotasEspeciales { get; set; }
    public List<CreateDetalleVentaDto> Detalles { get; set; } = new();
}

/// <summary>
/// DTO para detalle de venta
/// </summary>
public class DetalleVentaDto
{
    public int Id { get; set; }
    public int ProductoId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal { get; set; }
}

/// <summary>
/// DTO para crear detalle de venta
/// </summary>
public class CreateDetalleVentaDto
{
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
}

/// <summary>
/// DTO para pago
/// </summary>
public class PagoDto
{
    public int Id { get; set; }
    public int VentaId { get; set; }
    public int MedioPagoId { get; set; }
    public string MedioPagoNombre { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public DateTime FechaPago { get; set; }
    public string? ReferenciaPago { get; set; }
    public string EstadoPago { get; set; } = string.Empty;
}

/// <summary>
/// DTO para crear pago
/// </summary>
public class CreatePagoDto
{
    public int VentaId { get; set; }
    public int MedioPagoId { get; set; }
    public decimal Monto { get; set; }
    public string? ReferenciaPago { get; set; }
    public string EstadoPago { get; set; } = "Pendiente";
}

/// <summary>
/// DTO para estado de venta
/// </summary>
public class EstadoVentaDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public bool EsEstadoFinal { get; set; }
}

/// <summary>
/// DTO para medio de pago
/// </summary>
public class MedioPagoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public bool Activo { get; set; }
    public decimal? ComisionPorcentaje { get; set; }
}
