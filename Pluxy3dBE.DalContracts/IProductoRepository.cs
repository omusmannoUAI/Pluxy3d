using Pluxy3dBE.Entities;

namespace Pluxy3dBE.DalContracts;

/// <summary>
/// Product repository interface with basic querying capabilities
/// </summary>
public interface IProductoRepository : IRepository<Producto>
{
    /// <summary>
    /// Busca productos por nombre o descripción
    /// </summary>
    Task<IEnumerable<Producto>> SearchAsync(string searchTerm);

    /// <summary>
    /// Obtiene productos por categoría
    /// </summary>
    Task<IEnumerable<Producto>> GetByCategoriaAsync(string categoria);

    /// <summary>
    /// Obtiene productos por marca
    /// </summary>
    Task<IEnumerable<Producto>> GetByMarcaAsync(string marca);

    /// <summary>
    /// Obtiene productos en un rango de precios
    /// </summary>
    Task<IEnumerable<Producto>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice);

    /// <summary>
    /// Obtiene productos activos solamente
    /// </summary>
    Task<IEnumerable<Producto>> GetActiveProductsAsync();

    /// <summary>
    /// Obtiene productos con stock disponible
    /// </summary>
    Task<IEnumerable<Producto>> GetInStockProductsAsync();

    /// <summary>
    /// Actualiza el stock de un producto
    /// </summary>
    Task<bool> UpdateStockAsync(int productoId, int newStock);

    /// <summary>
    /// Obtiene todas las categorías únicas
    /// </summary>
    Task<IEnumerable<string>> GetCategoriasAsync();

    /// <summary>
    /// Obtiene todas las marcas únicas
    /// </summary>
    Task<IEnumerable<string>> GetMarcasAsync();
}
