using Pluxy3dBE.Entities;

namespace Pluxy3dBE.DalContracts;

/// <summary>
/// Interfaz genérica para repositorios
/// </summary>
/// <typeparam name="T">Tipo de entidad</typeparam>
public interface IRepository<T> where T : class
{
    /// <summary>
    /// Obtiene todas las entidades
    /// </summary>
    Task<IEnumerable<T>> GetAllAsync();

    /// <summary>
    /// Obtiene una entidad por ID
    /// </summary>
    Task<T?> GetByIdAsync(int id);

    /// <summary>
    /// Agrega una nueva entidad
    /// </summary>
    Task<T> AddAsync(T entity);

    /// <summary>
    /// Actualiza una entidad existente
    /// </summary>
    Task<T> UpdateAsync(T entity);

    /// <summary>
    /// Elimina una entidad por ID
    /// </summary>
    Task<bool> DeleteAsync(int id);

    /// <summary>
    /// Verifica si existe una entidad con el ID especificado
    /// </summary>
    Task<bool> ExistsAsync(int id);

    /// <summary>
    /// Obtiene entidades con paginación
    /// </summary>
    Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(int page, int pageSize);
}
