namespace Pluxy3dBE.DomainContracts.DTOs;

/// <summary>
/// DTO para resultados paginados
/// </summary>
/// <typeparam name="T">Tipo de elementos en la página</typeparam>
public class PagedResult<T>
{
    /// <summary>
    /// Elementos de la página actual
    /// </summary>
    public IEnumerable<T> Items { get; set; } = new List<T>();

    /// <summary>
    /// Total de elementos disponibles
    /// </summary>
    public int TotalCount { get; set; }

    /// <summary>
    /// Página actual (base 1)
    /// </summary>
    public int Page { get; set; }

    /// <summary>
    /// Tamaño de página
    /// </summary>
    public int PageSize { get; set; }

    /// <summary>
    /// Total de páginas
    /// </summary>
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);

    /// <summary>
    /// Indica si hay página anterior
    /// </summary>
    public bool HasPreviousPage => Page > 1;

    /// <summary>
    /// Indica si hay página siguiente
    /// </summary>
    public bool HasNextPage => Page < TotalPages;
}
