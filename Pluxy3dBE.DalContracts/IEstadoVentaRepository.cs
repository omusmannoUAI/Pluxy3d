using Pluxy3dBE.Entities;

namespace Pluxy3dBE.DalContracts;

/// <summary>
/// Repositorio para consultar estados de venta (estados_venta)
/// </summary>
public interface IEstadoVentaRepository
{
    /// <summary>
    /// Obtiene el nombre del estado por id. Devuelve string.Empty si no existe.
    /// </summary>
    Task<string> GetNombreByIdAsync(int estadoId);

    /// <summary>
    /// Obtiene el id del estado por nombre. Crea si no existe (opcional) o devuelve 0 si no existe.
    /// </summary>
    Task<int> GetIdByNombreAsync(string nombre);

    /// <summary>
    /// Lista todos los estados disponibles.
    /// </summary>
    Task<IEnumerable<EstadosVentum>> GetAllAsync();
}
