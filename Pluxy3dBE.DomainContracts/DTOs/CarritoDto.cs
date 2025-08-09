namespace Pluxy3dBE.DomainContracts.DTOs;

/// <summary>
/// DTO para item del carrito
/// </summary>
public class CarritoItemDto
{
    public int Id { get; set; }
    public int ImpresoraId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public string ProductoImage { get; set; } = string.Empty;
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal PrecioTotal { get; set; }
}

/// <summary>
/// DTO para agregar item al carrito
/// </summary>
public class AddCarritoItemDto
{
    public int ImpresoraId { get; set; }
    public int Cantidad { get; set; }
    public string? UsuarioId { get; set; }
    public string? SessionId { get; set; }
}

/// <summary>
/// DTO para actualizar cantidad en carrito
/// </summary>
public class UpdateCarritoItemDto
{
    public int ItemId { get; set; }
    public int NuevaCantidad { get; set; }
}

/// <summary>
/// DTO para el carrito completo
/// </summary>
public class CarritoDto
{
    public List<CarritoItemDto> Items { get; set; } = new();
    public decimal Total { get; set; }
    public int TotalItems { get; set; }
}

/// <summary>
/// DTO para transferir carrito de sesión a usuario
/// </summary>
public class TransferCarritoDto
{
    public string SessionId { get; set; } = string.Empty;
    public string UsuarioId { get; set; } = string.Empty;
}

/// <summary>
/// DTO para descuentos aplicables a productos
/// </summary>
public class DiscountDto
{
    public int Percentage { get; set; }
    public decimal OriginalPrice { get; set; }
    public decimal DiscountedPrice { get; set; }
}
