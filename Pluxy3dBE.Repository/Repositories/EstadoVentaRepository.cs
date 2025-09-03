using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Entities;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Repository.Repositories;

public class EstadoVentaRepository(AppDbContextFromDb db) : IEstadoVentaRepository
{
    public async Task<string> GetNombreByIdAsync(int estadoId)
    {
        var nombre = await db.EstadosVenta
            .Where(e => e.EstadoId == estadoId)
            .Select(e => e.Nombre!)
            .FirstOrDefaultAsync();
        return nombre ?? string.Empty;
    }

    public async Task<int> GetIdByNombreAsync(string nombre)
    {
        if (string.IsNullOrWhiteSpace(nombre)) return 0;
        var normalized = nombre.Trim();
        var id = await db.EstadosVenta
            .Where(e => e.Nombre != null && e.Nombre == normalized)
            .Select(e => e.EstadoId)
            .FirstOrDefaultAsync();
        return id;
    }

    public async Task<IEnumerable<EstadosVentum>> GetAllAsync()
        => await db.EstadosVenta.AsNoTracking().OrderBy(e => e.EstadoId).ToListAsync();
}
