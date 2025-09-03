using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.DomainContracts.Services;

/// <summary>
/// Interfaz de servicio para carrito
/// </summary>
public interface ICarritoService
{
    /// <summary>
    /// Obtiene el carrito de un usuario o sesión
    /// </summary>
    Task<CarritoDto> GetCarritoAsync(string? usuarioId, string? sessionId);

    /// <summary>
    /// Agrega un item al carrito
    /// </summary>
    Task<CarritoItemDto> AddItemToCarritoAsync(AddCarritoItemDto addItemDto);

    /// <summary>
    /// Obtiene un item del carrito por su ID
    /// </summary>
    Task<CarritoItemDto?> GetItemByIdAsync(int itemId);

    /// <summary>
    /// Actualiza la cantidad de un item en el carrito
    /// </summary>
    Task<bool> UpdateItemCantidadAsync(UpdateCarritoItemDto updateDto);

    /// <summary>
    /// Elimina un item del carrito
    /// </summary>
    Task<bool> RemoveItemFromCarritoAsync(int itemId);

    /// <summary>
    /// Limpia todo el carrito
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
    /// Transfiere items de carrito de sesión a usuario
    /// </summary>
    Task<bool> TransferSessionCartToUserAsync(TransferCarritoDto transferDto);
}
