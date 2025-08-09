using Pluxy3dBE.Entities;

namespace Pluxy3dBE.DalContracts;

/// <summary>
/// Contrato específico para el repositorio de la entidad Carrito (no CarritoItem)
/// </summary>
public interface ICarritoMainRepository : IRepository<Carrito>
{
    /// <summary>
    /// Obtiene carrito por usuario ID - devuelve la entidad Carrito completa
    /// </summary>
    Task<Carrito?> GetCarritoByUsuarioAsync(Guid usuarioId);
    
    /// <summary>
    /// Crea un nuevo carrito para un usuario
    /// </summary>
    Task<Carrito> CreateCarritoForUserAsync(Guid usuarioId);
}
