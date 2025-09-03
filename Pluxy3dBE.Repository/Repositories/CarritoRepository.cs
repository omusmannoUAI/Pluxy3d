using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Entities;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Repository.Repositories;

public class CarritoRepository(AppDbContextFromDb db) : ICarritoRepository
{
	// IRepository<CarritoItem>
	public async Task<IEnumerable<CarritoItem>> GetAllAsync()
		=> await db.CarritoItems
			.Include(c => c.Impresora)!.ThenInclude(i => i!.Producto)
			.AsNoTracking()
			.ToListAsync();

	public async Task<CarritoItem?> GetByIdAsync(int id)
		=> await db.CarritoItems
			.Include(c => c.Impresora)!.ThenInclude(i => i!.Producto)
			.AsNoTracking()
			.FirstOrDefaultAsync(c => c.ItemId == id);

	public async Task<CarritoItem> AddAsync(CarritoItem entity)
	{
		db.CarritoItems.Add(entity);
		await db.SaveChangesAsync();
		return entity;
	}

	public async Task<CarritoItem> UpdateAsync(CarritoItem entity)
	{
		db.CarritoItems.Update(entity);
		await db.SaveChangesAsync();
		return entity;
	}

	public async Task<bool> DeleteAsync(int id)
	{
		var existing = await db.CarritoItems.FindAsync(id);
		if (existing == null) return false;
		db.CarritoItems.Remove(existing);
		await db.SaveChangesAsync();
		return true;
	}

	public async Task<bool> ExistsAsync(int id)
		=> await db.CarritoItems.AnyAsync(c => c.ItemId == id);

	public async Task<(IEnumerable<CarritoItem> Items, int TotalCount)> GetPagedAsync(int page, int pageSize)
	{
		if (page <= 0) page = 1;
		if (pageSize <= 0 || pageSize > 200) pageSize = 50;
		var q = db.CarritoItems
			.Include(c => c.Impresora)!.ThenInclude(i => i!.Producto)
			.AsNoTracking()
			.OrderBy(c => c.ItemId);
		var total = await q.CountAsync();
		var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
		return (items, total);
	}

	// ICarritoRepository specifics
	public async Task<IEnumerable<CarritoItem>> GetByUsuarioIdAsync(string usuarioId)
	{
		if (!Guid.TryParse(usuarioId, out var uid)) return Enumerable.Empty<CarritoItem>();
		var carrito = await db.Carritos
			.Include(c => c.CarritoItems)!.ThenInclude(ci => ci.Impresora)!.ThenInclude(i => i!.Producto)
			.FirstOrDefaultAsync(c => c.UsuarioId == uid);

		return carrito?.CarritoItems ?? Enumerable.Empty<CarritoItem>();
	}

	public Task<IEnumerable<CarritoItem>> GetBySessionIdAsync(string sessionId)
	{
		// Not supported by current schema; returning empty set
		return Task.FromResult(Enumerable.Empty<CarritoItem>());
	}

	public async Task<CarritoItem?> GetItemAsync(int productoId, string? usuarioId, string? sessionId)
	{
		// Interpreting 'productoId' as ImpresoraId due to schema naming
		var query = db.CarritoItems.AsQueryable();

		if (!string.IsNullOrWhiteSpace(usuarioId) && Guid.TryParse(usuarioId, out var uid))
		{
			query = query.Where(ci => ci.Carrito != null && ci.Carrito.UsuarioId == uid);
		}
		// Session-based carts not supported currently

		return await query
			.Include(ci => ci.Impresora)!.ThenInclude(i => i!.Producto)
			.FirstOrDefaultAsync(ci => ci.ImpresoraId == productoId);
	}

	public async Task<bool> UpdateCantidadAsync(int itemId, int nuevaCantidad)
	{
		var item = await db.CarritoItems.FirstOrDefaultAsync(ci => ci.ItemId == itemId);
		if (item == null) return false;
		item.Cantidad = nuevaCantidad;
		await db.SaveChangesAsync();
		return true;
	}

	public async Task<bool> RemoveItemAsync(int productoId, string? usuarioId, string? sessionId)
	{
		var item = await GetItemAsync(productoId, usuarioId, sessionId);
		if (item == null) return false;
		db.CarritoItems.Remove(item);
		await db.SaveChangesAsync();
		return true;
	}

	public async Task<bool> ClearCarritoAsync(string? usuarioId, string? sessionId)
	{
		if (!string.IsNullOrWhiteSpace(usuarioId) && Guid.TryParse(usuarioId, out var uid))
		{
			var items = db.CarritoItems.Where(ci => ci.Carrito != null && ci.Carrito.UsuarioId == uid);
			db.CarritoItems.RemoveRange(items);
			await db.SaveChangesAsync();
			return true;
		}
		// Session clear not supported; no-op
		return false;
	}

	public async Task<decimal> GetCarritoTotalAsync(string? usuarioId, string? sessionId)
	{
		if (!string.IsNullOrWhiteSpace(usuarioId) && Guid.TryParse(usuarioId, out var uid))
		{
			var items = await db.CarritoItems
				.Include(ci => ci.Impresora)
				.Where(ci => ci.Carrito != null && ci.Carrito.UsuarioId == uid)
				.ToListAsync();
			return items.Sum(i => (i.Cantidad ?? 0) * (i.Impresora?.TotalFinal ?? 0m));
		}
		return 0m;
	}

	public async Task<int> GetCarritoItemCountAsync(string? usuarioId, string? sessionId)
	{
		if (!string.IsNullOrWhiteSpace(usuarioId) && Guid.TryParse(usuarioId, out var uid))
		{
			return await db.CarritoItems.CountAsync(ci => ci.Carrito != null && ci.Carrito.UsuarioId == uid);
		}
		return 0;
	}

	public Task<bool> TransferSessionCartToUserAsync(string sessionId, string usuarioId)
	{
		// Not supported with current schema
		return Task.FromResult(true);
	}

	public async Task<Carrito?> GetCarritoByUsuarioAsync(Guid usuarioId)
		=> await db.Carritos
			.Include(c => c.CarritoItems)!.ThenInclude(ci => ci.Impresora)!.ThenInclude(i => i!.Producto)
			.FirstOrDefaultAsync(c => c.UsuarioId == usuarioId);
}

