using Microsoft.AspNetCore.Mvc;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.Controllers;

[Route("api/productos")]
public class ProductosController : BaseController
{
    private readonly IProductoService _service;

    public ProductosController(IProductoService service, ILogger<ProductosController> logger) 
        : base(logger)
    {
        _service = service;
    }

    /// <summary>
    /// Gets products with filtering, pagination and sorting
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetProductos(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? category = null,
        [FromQuery] int? categoryId = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] bool? isActive = true,
        [FromQuery] bool? inStock = null,
        [FromQuery] string? marca = null,
        [FromQuery] string sortBy = "nombre",
        [FromQuery] bool sortDescending = false)
    {
        return await SafeExecuteAsync(
            async () =>
            {
                // Normalize pagination parameters
                var (normalizedPage, normalizedPageSize) = NormalizePagination(page, pageSize);
                
                // Build search criteria using all parameters
                var searchDto = new ProductoSearchDto
                {
                    SearchTerm = searchTerm,
                    Categoria = category,
                    CategoriaId = categoryId,
                    Marca = marca,
                    PrecioMin = minPrice,
                    PrecioMax = maxPrice,
                    SoloActivos = isActive,
                    SoloConStock = inStock,
                    Page = normalizedPage,
                    PageSize = normalizedPageSize,
                    SortBy = sortBy,
                    Desc = sortDescending
                };

                var result = await _service.SearchProductosAsync(searchDto);
                
                return result;
            },
            "Get Products with Search Criteria"
        );
    }

    /// <summary>
    /// Gets a specific product by ID
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProducto(int id)
    {
        if (!ValidateRequired((nameof(id), id)))
        {
            return ValidationErrorResponse();
        }

        return await SafeExecuteAsync(
            async () =>
            {
                var producto = await _service.GetProductoByIdAsync(id);
                if (producto == null)
                {
                    throw new KeyNotFoundException($"Product with ID {id} not found");
                }
                return producto;
            },
            "Get Product by ID"
        );
    }

    /// <summary>
    /// Gets all available categories
    /// </summary>
    [HttpGet("categorias")]
    public async Task<IActionResult> GetCategorias()
    {
        return await SafeExecuteAsync(
            async () => await _service.GetCategoriasAsync(),
            "Get Product Categories"
        );
    }

    /// <summary>
    /// Gets all available brands
    /// </summary>
    [HttpGet("marcas")]
    public async Task<IActionResult> GetMarcas()
    {
        return await SafeExecuteAsync(
            async () => await _service.GetMarcasAsync(),
            "Get Product Brands"
        );
    }
}
