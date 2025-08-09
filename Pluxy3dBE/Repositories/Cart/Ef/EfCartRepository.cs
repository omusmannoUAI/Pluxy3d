using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Repositories.Cart.Ef;

public class EfCartRepository(AppDbContextFromDb db) : ICartRepository
{
    public async Task<IEnumerable<CarritoItemDto>> GetItemsAsync()
    {
        var items = await db.SimpleCartItems.AsNoTracking().ToListAsync();
        var productIds = items.Select(i => i.ProductId).Distinct().ToArray();
        var products = await db.Productos.Where(p => productIds.Contains(p.ProductoId)).AsNoTracking().ToDictionaryAsync(p => p.ProductoId);
        return items.Select(i =>
        {
            products.TryGetValue(i.ProductId, out var p);
            return new CarritoItemDto(
                i.Id,
                i.ProductId,
                p?.Nombre ?? $"Producto {i.ProductId}",
                p?.Descripcion,
                p?.PrecioBase ?? 0m,
                i.Quantity,
                p?.Image
            );
        });
    }

    public async Task<CarritoItemDto?> GetItemAsync(int id)
    {
        var i = await db.SimpleCartItems.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (i is null) return null;
        var p = await db.Productos.AsNoTracking().FirstOrDefaultAsync(x => x.ProductoId == i.ProductId);
        return new CarritoItemDto(i.Id, i.ProductId, p?.Nombre ?? $"Producto {i.ProductId}", p?.Descripcion, p?.PrecioBase ?? 0m, i.Quantity, p?.Image);
    }

    public async Task<CarritoItemDto> AddItemAsync(CreateCartItemDto dto)
    {
        var entity = new Entities.SimpleCartItem { ProductId = dto.ProductId, Quantity = dto.Quantity, CreatedAt = DateTime.UtcNow };
        db.SimpleCartItems.Add(entity);
        await db.SaveChangesAsync();
        var p = await db.Productos.AsNoTracking().FirstOrDefaultAsync(x => x.ProductoId == dto.ProductId);
        return new CarritoItemDto(entity.Id, entity.ProductId, p?.Nombre ?? $"Producto {entity.ProductId}", p?.Descripcion, p?.PrecioBase ?? 0m, entity.Quantity, p?.Image);
    }

    public async Task<CarritoItemDto> UpdateQuantityAsync(int id, int quantity)
    {
        var entity = await db.SimpleCartItems.FirstOrDefaultAsync(x => x.Id == id) ?? throw new KeyNotFoundException($"Item {id} not found");
        entity.Quantity = quantity;
        await db.SaveChangesAsync();
        var p = await db.Productos.AsNoTracking().FirstOrDefaultAsync(x => x.ProductoId == entity.ProductId);
        return new CarritoItemDto(entity.Id, entity.ProductId, p?.Nombre ?? $"Producto {entity.ProductId}", p?.Descripcion, p?.PrecioBase ?? 0m, entity.Quantity, p?.Image);
    }

    public async Task DeleteItemAsync(int id)
    {
        var entity = await db.SimpleCartItems.FirstOrDefaultAsync(x => x.Id == id);
        if (entity != null)
        {
            db.SimpleCartItems.Remove(entity);
            await db.SaveChangesAsync();
        }
    }

    public async Task ClearAsync()
    {
        // Simple truncate approach for demo; replace with filtered delete if user/session scoping is added
        db.SimpleCartItems.RemoveRange(db.SimpleCartItems);
        await db.SaveChangesAsync();
    }
}
