using Pluxy3dBE.Entities;

namespace Pluxy3dBE.DalContracts;

/// <summary>
/// Contrato específico para el repositorio de carrito
/// </summary>
public interface ICarritoRepository : IRepository<CarritoItem>
{
    /// <summary>
    /// Obtiene todos los items del carrito por ID de usuario
    /// </summary>
    Task<IEnumerable<CarritoItem>> GetByUsuarioIdAsync(string usuarioId);

    /// <summary>
    /// Obtiene todos los items del carrito por ID de sesión
    /// </summary>
    Task<IEnumerable<CarritoItem>> GetBySessionIdAsync(string sessionId);

    /// <summary>
    /// Obtiene un item específico del carrito
    /// </summary>
    Task<CarritoItem?> GetItemAsync(int productoId, string? usuarioId, string? sessionId);

    /// <summary>
    /// Actualiza la cantidad de un item en el carrito
    /// </summary>
    Task<bool> UpdateCantidadAsync(int itemId, int nuevaCantidad);

    /// <summary>
    /// Elimina un item específico del carrito
    /// </summary>
    Task<bool> RemoveItemAsync(int productoId, string? usuarioId, string? sessionId);

    /// <summary>
    /// Limpia todo el carrito de un usuario
    /// </summary>
    Task<bool> ClearCarritoAsync(string? usuarioId, string? sessionId);

    /// <summary>
    /// Obtiene el total del carrito
    /// </summary>
    Task<decimal> GetCarritoTotalAsync(string? usuarioId, string? sessionId);

    /// <summary>
    /// Obtiene el número de items en el carrito
    /// </summary>
    Task<int> GetCarritoItemCountAsync(string? usuarioId, string? sessionId);

    /// <summary>
    /// Transfiere items de carrito de sesión a usuario autenticado
    /// </summary>
    Task<bool> TransferSessionCartToUserAsync(string sessionId, string usuarioId);
}
