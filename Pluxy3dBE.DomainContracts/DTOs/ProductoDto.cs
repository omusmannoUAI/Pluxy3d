namespace Pluxy3dBE.DomainContracts.DTOs;

/// <summary>
/// DTO para producto
/// </summary>
public class ProductoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public string Image { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
    public string Marca { get; set; } = string.Empty;
    public int Stock { get; set; }
    public bool Activo { get; set; }
}

/// <summary>
/// DTO para búsqueda de productos
/// </summary>
public class ProductoSearchDto
{
    public string? SearchTerm { get; set; }
    public string? Categoria { get; set; }
    public int? CategoriaId { get; set; }
    public string? Marca { get; set; }
    public decimal? PrecioMin { get; set; }
    public decimal? PrecioMax { get; set; }
    public bool? SoloActivos { get; set; } = true;
    public bool? SoloConStock { get; set; } = true;
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public bool Desc { get; set; } = false;
}
