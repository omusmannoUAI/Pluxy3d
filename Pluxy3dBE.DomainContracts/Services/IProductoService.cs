using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.DomainContracts.Services;

/// <summary>
/// Interfaz de servicio para productos
/// </summary>
public interface IProductoService
{
    /// <summary>
    /// Obtiene todos los productos
    /// </summary>
    Task<IEnumerable<ProductoDto>> GetAllProductosAsync();

    /// <summary>
    /// Obtiene un producto por ID
    /// </summary>
    Task<ProductoDto?> GetProductoByIdAsync(int id);

    /// <summary>
    /// Busca productos con criterios específicos
    /// </summary>
    Task<PagedResult<ProductoDto>> SearchProductosAsync(ProductoSearchDto searchDto);

    /// <summary>
    /// Crea un nuevo producto
    /// </summary>
    Task<ProductoDto> CreateProductoAsync(CreateProductoDto createDto);

    /// <summary>
    /// Actualiza un producto existente
    /// </summary>
    Task<ProductoDto?> UpdateProductoAsync(int id, UpdateProductoDto updateDto);

    /// <summary>
    /// Elimina un producto
    /// </summary>
    Task<bool> DeleteProductoAsync(int id);

    /// <summary>
    /// Obtiene todas las categorías
    /// </summary>
    Task<IEnumerable<string>> GetCategoriasAsync();

    /// <summary>
    /// Obtiene todas las marcas
    /// </summary>
    Task<IEnumerable<string>> GetMarcasAsync();

    /// <summary>
    /// Actualiza el stock de un producto
    /// </summary>
    Task<bool> UpdateStockAsync(int productoId, int nuevoStock);
}
