using AutoMapper;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.DomainContracts.DTOs;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.Entities;

namespace Pluxy3dBE.Domain.Services;

/// <summary>
/// Implementación del servicio de productos
/// </summary>
public class ProductoService : IProductoService
{
    private readonly IProductoRepository _productoRepository;
    private readonly IMapper _mapper;

    public ProductoService(IProductoRepository productoRepository, IMapper mapper)
    {
        _productoRepository = productoRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ProductoDto>> GetAllProductosAsync()
    {
        var productos = await _productoRepository.GetActiveProductsAsync();
        return _mapper.Map<IEnumerable<ProductoDto>>(productos);
    }

    public async Task<ProductoDto?> GetProductoByIdAsync(int id)
    {
        var producto = await _productoRepository.GetByIdAsync(id);
        return producto != null ? _mapper.Map<ProductoDto>(producto) : null;
    }

    public async Task<PagedResult<ProductoDto>> SearchProductosAsync(ProductoSearchDto searchDto)
    {
        IEnumerable<Producto> productos;

        // Aplicar filtros de búsqueda
        if (!string.IsNullOrWhiteSpace(searchDto.SearchTerm))
        {
            productos = await _productoRepository.SearchAsync(searchDto.SearchTerm);
        }
        else if (!string.IsNullOrWhiteSpace(searchDto.Categoria))
        {
            productos = await _productoRepository.GetByCategoriaAsync(searchDto.Categoria);
        }
        else if (!string.IsNullOrWhiteSpace(searchDto.Marca))
        {
            productos = await _productoRepository.GetByMarcaAsync(searchDto.Marca);
        }
        else if (searchDto.PrecioMin.HasValue && searchDto.PrecioMax.HasValue)
        {
            productos = await _productoRepository.GetByPriceRangeAsync(searchDto.PrecioMin.Value, searchDto.PrecioMax.Value);
        }
        else
        {
            productos = searchDto.SoloActivos == true 
                ? await _productoRepository.GetActiveProductsAsync()
                : await _productoRepository.GetAllAsync();
        }

        // Filtros adicionales
        if (searchDto.SoloConStock == true)
        {
            productos = productos.Where(p => p.Stock > 0);
        }

        if (searchDto.PrecioMin.HasValue && searchDto.PrecioMax.HasValue)
        {
            productos = productos.Where(p => p.PrecioBase >= searchDto.PrecioMin && p.PrecioBase <= searchDto.PrecioMax);
        }

        // Paginación
        var totalCount = productos.Count();
        var pagedProductos = productos
            .Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .ToList();

        var productosDto = _mapper.Map<IEnumerable<ProductoDto>>(pagedProductos);

        return new PagedResult<ProductoDto>
        {
            Items = productosDto,
            TotalCount = totalCount,
            Page = searchDto.Page,
            PageSize = searchDto.PageSize
        };
    }

    public async Task<ProductoDto> CreateProductoAsync(CreateUpdateProductoDto createDto)
    {
        var producto = _mapper.Map<Producto>(createDto);
        
        var createdProducto = await _productoRepository.AddAsync(producto);
        return _mapper.Map<ProductoDto>(createdProducto);
    }

    public async Task<ProductoDto> CreateProductoAsync(CreateProductoDto createDto)
    {
        var producto = _mapper.Map<Producto>(createDto);

        var createdProducto = await _productoRepository.AddAsync(producto);
        return _mapper.Map<ProductoDto>(createdProducto);
    }

    public async Task<ProductoDto?> UpdateProductoAsync(int id, CreateUpdateProductoDto updateDto)
    {
        var existingProducto = await _productoRepository.GetByIdAsync(id);
        if (existingProducto == null)
            return null;

        _mapper.Map(updateDto, existingProducto);

        var updatedProducto = await _productoRepository.UpdateAsync(existingProducto);
        return _mapper.Map<ProductoDto>(updatedProducto);
    }

    public async Task<ProductoDto?> UpdateProductoAsync(int id, UpdateProductoDto updateDto)
    {
        var existingProducto = await _productoRepository.GetByIdAsync(id);
        if (existingProducto == null)
            return null;

        _mapper.Map(updateDto, existingProducto);

        var updatedProducto = await _productoRepository.UpdateAsync(existingProducto);
        return _mapper.Map<ProductoDto>(updatedProducto);
    }

    public async Task<bool> DeleteProductoAsync(int id)
    {
        return await _productoRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<string>> GetCategoriasAsync()
    {
        return await _productoRepository.GetCategoriasAsync();
    }

    public async Task<IEnumerable<string>> GetMarcasAsync()
    {
        return await _productoRepository.GetMarcasAsync();
    }

    public async Task<bool> UpdateStockAsync(int productoId, int nuevoStock)
    {
        return await _productoRepository.UpdateStockAsync(productoId, nuevoStock);
    }
}
