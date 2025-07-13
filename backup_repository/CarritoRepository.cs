using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Entities;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Repository.Repositories;

/// <summary>
/// Implementación del repositorio de carrito
/// </summary>
public class CarritoRepository : BaseRepository<CarritoItem>, ICarritoRepository
{
    public CarritoRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<CarritoItem>> GetByUsuarioIdAsync(string usuarioId)
    {
        return await _dbSet
            .Include(c => c.Producto)
            .Where(c => c.UsuarioId == usuarioId)
            .OrderBy(c => c.FechaAgregado)
            .ToListAsync();
    }

    public async Task<IEnumerable<CarritoItem>> GetBySessionIdAsync(string sessionId)
    {
        return await _dbSet
            .Include(c => c.Producto)
            .Where(c => c.SessionId == sessionId)
            .OrderBy(c => c.FechaAgregado)
            .ToListAsync();
    }

    public async Task<CarritoItem?> GetItemAsync(int productoId, string? usuarioId, string? sessionId)
    {
        var query = _dbSet.Include(c => c.Producto)
                         .Where(c => c.ProductoId == productoId);

        if (!string.IsNullOrEmpty(usuarioId))
        {
            query = query.Where(c => c.UsuarioId == usuarioId);
        }
        else if (!string.IsNullOrEmpty(sessionId))
        {
            query = query.Where(c => c.SessionId == sessionId);
        }
        else
        {
            return null;
        }

        return await query.FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateCantidadAsync(int itemId, int nuevaCantidad)
    {
        var item = await GetByIdAsync(itemId);
        if (item == null)
            return false;

        if (nuevaCantidad <= 0)
        {
            return await DeleteAsync(itemId);
        }

        item.Cantidad = nuevaCantidad;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RemoveItemAsync(int productoId, string? usuarioId, string? sessionId)
    {
        var item = await GetItemAsync(productoId, usuarioId, sessionId);
        if (item == null)
            return false;

        _dbSet.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ClearCarritoAsync(string? usuarioId, string? sessionId)
    {
        IQueryable<CarritoItem> query = _dbSet;

        if (!string.IsNullOrEmpty(usuarioId))
        {
            query = query.Where(c => c.UsuarioId == usuarioId);
        }
        else if (!string.IsNullOrEmpty(sessionId))
        {
            query = query.Where(c => c.SessionId == sessionId);
        }
        else
        {
            return false;
        }

        var items = await query.ToListAsync();
        if (!items.Any())
            return true;

        _dbSet.RemoveRange(items);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<decimal> GetCarritoTotalAsync(string? usuarioId, string? sessionId)
    {
        IQueryable<CarritoItem> query = _dbSet;

        if (!string.IsNullOrEmpty(usuarioId))
        {
            query = query.Where(c => c.UsuarioId == usuarioId);
        }
        else if (!string.IsNullOrEmpty(sessionId))
        {
            query = query.Where(c => c.SessionId == sessionId);
        }
        else
        {
            return 0;
        }

        return await query.SumAsync(c => c.Cantidad * c.PrecioUnitario);
    }

    public async Task<int> GetCarritoItemCountAsync(string? usuarioId, string? sessionId)
    {
        IQueryable<CarritoItem> query = _dbSet;

        if (!string.IsNullOrEmpty(usuarioId))
        {
            query = query.Where(c => c.UsuarioId == usuarioId);
        }
        else if (!string.IsNullOrEmpty(sessionId))
        {
            query = query.Where(c => c.SessionId == sessionId);
        }
        else
        {
            return 0;
        }

        return await query.SumAsync(c => c.Cantidad);
    }

    public async Task<bool> TransferSessionCartToUserAsync(string sessionId, string usuarioId)
    {
        var sessionItems = await _dbSet
            .Where(c => c.SessionId == sessionId)
            .ToListAsync();

        if (!sessionItems.Any())
            return true;

        // Buscar items existentes del usuario
        var userItems = await _dbSet
            .Where(c => c.UsuarioId == usuarioId)
            .ToListAsync();

        foreach (var sessionItem in sessionItems)
        {
            var existingUserItem = userItems
                .FirstOrDefault(ui => ui.ProductoId == sessionItem.ProductoId);

            if (existingUserItem != null)
            {
                // Combinar cantidades
                existingUserItem.Cantidad += sessionItem.Cantidad;
                _dbSet.Remove(sessionItem);
            }
            else
            {
                // Transferir el item
                sessionItem.UsuarioId = usuarioId;
                sessionItem.SessionId = null;
            }
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
