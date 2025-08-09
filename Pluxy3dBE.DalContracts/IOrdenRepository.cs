using Pluxy3dBE.Entities;

namespace Pluxy3dBE.DalContracts;

/// <summary>
/// Contrato específico para el repositorio de órdenes
/// </summary>
public interface IOrdenRepository : IRepository<Venta>
{
    /// <summary>
    /// Obtiene órdenes por ID de usuario
    /// </summary>
    Task<IEnumerable<Venta>> GetByUsuarioIdAsync(Guid usuarioId);

    /// <summary>
    /// Obtiene una Venta por número de Venta
    /// </summary>
    Task<Venta?> GetByNumeroVentaAsync(string numeroVenta);

    /// <summary>
    /// Obtiene órdenes por estado
    /// </summary>
    Task<IEnumerable<Venta>> GetByEstadoAsync(string estado);

    /// <summary>
    /// Obtiene órdenes en un rango de fechas
    /// </summary>
    Task<IEnumerable<Venta>> GetByDateRangeAsync(DateTime fechaInicio, DateTime fechaFin);

    /// <summary>
    /// Actualiza el estado de una Venta
    /// </summary>
    Task<bool> UpdateEstadoAsync(int VentaId, string nuevoEstado);

    /// <summary>
    /// Obtiene el total de ventas en un período
    /// </summary>
    Task<decimal> GetTotalVentasAsync(DateTime fechaInicio, DateTime fechaFin);

    /// <summary>
    /// Obtiene estadísticas de órdenes
    /// </summary>
    Task<Dictionary<string, int>> GetEstadisticasEstadosAsync();

    /// <summary>
    /// Genera número de Venta único
    /// </summary>
    Task<string> GenerateNumeroVentaAsync();
}
