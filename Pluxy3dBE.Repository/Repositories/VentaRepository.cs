using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.DalContracts.Repositories;
using Pluxy3dBE.Entities;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Repository.Repositories;

public class VentaRepository(AppDbContextFromDb db) : IVentaRepository
{
    // IRepository<Venta>
    public async Task<IEnumerable<Venta>> GetAllAsync()
        => await db.Ventas.AsNoTracking().ToListAsync();

    public async Task<Venta?> GetByIdAsync(int id)
        => await db.Ventas.AsNoTracking().FirstOrDefaultAsync(v => v.VentaId == id);

    public async Task<Venta> AddAsync(Venta entity)
    {
        db.Ventas.Add(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    public async Task<Venta> UpdateAsync(Venta entity)
    {
        db.Ventas.Update(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await db.Ventas.FindAsync(id);
        if (existing == null) return false;
        db.Ventas.Remove(existing);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
        => await db.Ventas.AnyAsync(v => v.VentaId == id);

    public async Task<(IEnumerable<Venta> Items, int TotalCount)> GetPagedAsync(int page, int pageSize)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0 || pageSize > 200) pageSize = 50;
        var q = db.Ventas.AsNoTracking().OrderBy(v => v.VentaId);
        var total = await q.CountAsync();
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (items, total);
    }

    // IVentaRepository specifics
    public async Task<IEnumerable<Venta>> GetByUsuarioIdAsync(Guid usuarioId)
        => await db.Ventas.AsNoTracking().Where(v => v.UsuarioId == usuarioId).ToListAsync();

    public async Task<IEnumerable<Venta>> GetByEstadoAsync(int estadoId)
        => await db.Ventas.AsNoTracking().Where(v => v.EstadoId == estadoId).ToListAsync();

    public async Task<IEnumerable<Venta>> GetByDateRangeAsync(DateTime fechaDesde, DateTime fechaHasta)
        => await db.Ventas.AsNoTracking().Where(v => v.FechaVenta >= fechaDesde && v.FechaVenta <= fechaHasta).ToListAsync();

    public async Task<bool> UpdateEstadoAsync(int ventaId, int nuevoEstadoId)
    {
        var v = await db.Ventas.FirstOrDefaultAsync(x => x.VentaId == ventaId);
        if (v == null) return false;
        v.EstadoId = nuevoEstadoId;
        await db.SaveChangesAsync();
        return true;
    }
}
