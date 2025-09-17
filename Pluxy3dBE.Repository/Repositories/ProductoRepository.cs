using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Entities;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Repository.Repositories;

public class ProductoRepository(AppDbContextFromDb db) : IProductoRepository
{
    private static readonly string[] KnownBrands = new[]
    {
        "Creality", "Hellbot", "Prusa", "Anycubic", "Artillery", "Elegoo", "Bambu Lab", "Flashforge"
    };

    private static string? InferBrand(Producto p)
    {
        var source = ($"{p.Nombre} {p.Descripcion}").ToLowerInvariant();
        foreach (var b in KnownBrands)
        {
            if (source.Contains(b.ToLowerInvariant()))
                return b;
        }
        return null;
    }

    // IRepository<T>
    public async Task<IEnumerable<Producto>> GetAllAsync()
        => await db.Productos.Include(p => p.Categoria).AsNoTracking().ToListAsync();

    public async Task<Producto?> GetByIdAsync(int id)
        => await db.Productos.Include(p => p.Categoria).AsNoTracking().FirstOrDefaultAsync(p => p.ProductoId == id);

    public async Task<Producto> AddAsync(Producto entity)
    {
        db.Productos.Add(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    public async Task<Producto> UpdateAsync(Producto entity)
    {
        db.Productos.Update(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await db.Productos.FindAsync(id);
        if (existing == null) return false;
        db.Productos.Remove(existing);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id)
        => await db.Productos.AnyAsync(p => p.ProductoId == id);

    public async Task<(IEnumerable<Producto> Items, int TotalCount)> GetPagedAsync(int page, int pageSize)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0 || pageSize > 200) pageSize = 20;
        var q = db.Productos.Include(p => p.Categoria).AsNoTracking().OrderBy(p => p.ProductoId);
        var total = await q.CountAsync();
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (items, total);
    }

    // IProductoRepository
    public async Task<IEnumerable<Producto>> SearchAsync(string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
            return await GetAllAsync();
        var term = searchTerm.Trim().ToLowerInvariant();
        return await db.Productos
            .Include(p => p.Categoria)
            .Where(p => (p.Nombre ?? "").ToLower().Contains(term) || (p.Descripcion ?? "").ToLower().Contains(term))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Producto>> GetByCategoriaAsync(string categoria)
    {
        if (string.IsNullOrWhiteSpace(categoria)) return Enumerable.Empty<Producto>();
        var normalized = categoria.Trim().ToLowerInvariant();
        return await db.Productos
            .Include(p => p.Categoria)
            .Where(p => (p.Categoria != null && ((p.Categoria.Nombre ?? string.Empty).Trim().ToLower() == normalized)))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Producto>> GetByMarcaAsync(string marca)
    {
        if (string.IsNullOrWhiteSpace(marca)) return Enumerable.Empty<Producto>();
        var normalized = marca.Trim().ToLowerInvariant();
        var all = await db.Productos.Include(p => p.Categoria).AsNoTracking().ToListAsync();
        return all.Where(p => (InferBrand(p) ?? string.Empty).ToLowerInvariant() == normalized);
    }

    public async Task<IEnumerable<Producto>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice)
        => await db.Productos
            .Include(p => p.Categoria)
            .Where(p => (p.PrecioBase ?? 0) >= minPrice && (p.PrecioBase ?? 0) <= maxPrice)
            .AsNoTracking()
            .ToListAsync();

    public async Task<IEnumerable<Producto>> GetActiveProductsAsync()
        => await db.Productos.Include(p => p.Categoria).Where(p => p.Visible == true).AsNoTracking().ToListAsync();

    public async Task<IEnumerable<Producto>> GetInStockProductsAsync()
        => await db.Productos.Include(p => p.Categoria).Where(p => (p.Stock ?? 0) > 0).AsNoTracking().ToListAsync();

    public async Task<bool> UpdateStockAsync(int productoId, int newStock)
    {
        var p = await db.Productos.FirstOrDefaultAsync(x => x.ProductoId == productoId);
        if (p == null) return false;
        p.Stock = newStock;
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<string>> GetCategoriasAsync()
    {
        // Prefer categories tied to products
        var names = await db.Productos
            .Include(p => p.Categoria)
            .Where(p => p.Categoria != null)
            .Select(p => p.Categoria!.Nombre!)
            .Distinct()
            .ToListAsync();
        return names.Where(n => !string.IsNullOrWhiteSpace(n))!;
    }

    public async Task<IEnumerable<string>> GetMarcasAsync()
    {
        var all = await db.Productos.AsNoTracking().ToListAsync();
        return all.Select(p => InferBrand(p)).Where(b => !string.IsNullOrWhiteSpace(b)).Distinct()!;
    }
}

