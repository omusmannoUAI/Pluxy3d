using System.ComponentModel.DataAnnotations;

namespace Pluxy3dBE.DomainContracts.DTOs;

/// <summary>
/// DTO para crear un nuevo producto
/// </summary>
public class CreateProductoDto
{
    /// <summary>
    /// Nombre del producto
    /// </summary>
    [Required(ErrorMessage = "El nombre es requerido")]
    [StringLength(200, ErrorMessage = "El nombre no puede exceder 200 caracteres")]
    public string Nombre { get; set; } = string.Empty;

    /// <summary>
    /// Descripción del producto
    /// </summary>
    [StringLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
    public string? Descripcion { get; set; }

    /// <summary>
    /// Precio del producto
    /// </summary>
    [Required(ErrorMessage = "El precio es requerido")]
    [Range(0, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
    public decimal Precio { get; set; }

    /// <summary>
    /// URL de la imagen del producto
    /// </summary>
    [StringLength(500, ErrorMessage = "La URL de la imagen no puede exceder 500 caracteres")]
    public string? Image { get; set; }

    /// <summary>
    /// Categoría del producto
    /// </summary>
    [StringLength(100, ErrorMessage = "La categoría no puede exceder 100 caracteres")]
    public string? Categoria { get; set; }

    /// <summary>
    /// Marca del producto
    /// </summary>
    [StringLength(100, ErrorMessage = "La marca no puede exceder 100 caracteres")]
    public string? Marca { get; set; }

    /// <summary>
    /// Stock disponible
    /// </summary>
    [Range(0, int.MaxValue, ErrorMessage = "El stock debe ser mayor o igual a 0")]
    public int Stock { get; set; } = 0;

    /// <summary>
    /// Indica si el producto está activo
    /// </summary>
    public bool IsActive { get; set; } = true;
}
