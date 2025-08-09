using Pluxy3dBE.Entities;

namespace Pluxy3dBE.DalContracts.Repositories;

/// <summary>
/// Repositorio para operaciones con ventas
/// </summary>
public interface IVentaRepository : IRepository<Venta>
{
    Task<IEnumerable<Venta>> GetByUsuarioIdAsync(Guid usuarioId);
    Task<IEnumerable<Venta>> GetByEstadoAsync(int estadoId);
    Task<IEnumerable<Venta>> GetByDateRangeAsync(DateTime fechaDesde, DateTime fechaHasta);
    Task<bool> UpdateEstadoAsync(int ventaId, int nuevoEstadoId);
}
