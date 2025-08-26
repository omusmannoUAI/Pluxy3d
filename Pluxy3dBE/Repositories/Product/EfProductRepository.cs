using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.Entities;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Repositories.Product;

public class EfProductRepository(AppDbContextFromDb db) : IProductRepository
{
    public async Task<IEnumerable<Producto>> GetVisibleAsync()
        => await db.Productos.Where(p => p.Visible == true)
            .Include(p => p.Categoria)
            .AsNoTracking().ToListAsync();

    public async Task<Producto?> GetByIdAsync(int id)
        => await db.Productos
            .Include(p => p.Categoria)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.ProductoId == id);

    public async Task<(IEnumerable<Producto> Items, int Total)> GetVisiblePagedAsync(int page, int pageSize, string? sortBy, bool descending)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0 || pageSize > 100) pageSize = 20;

        var query = db.Productos.Where(p => p.Visible == true)
            .Include(p => p.Categoria)
            .AsNoTracking();

        // Simple sorting
        query = (sortBy?.ToLowerInvariant()) switch
        {
            "name" or "nombre" => descending ? query.OrderByDescending(p => p.Nombre) : query.OrderBy(p => p.Nombre),
            "price" or "precio" => descending ? query.OrderByDescending(p => p.PrecioBase) : query.OrderBy(p => p.PrecioBase),
            _ => query.OrderBy(p => p.ProductoId)
        };

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<(IEnumerable<Producto> Items, int Total)> GetVisiblePagedByCategoryAsync(int page, int pageSize, string? sortBy, bool descending, int categoryId)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0 || pageSize > 100) pageSize = 20;

        var query = db.Productos.Where(p => p.Visible == true && p.CategoriaId == categoryId)
            .Include(p => p.Categoria)
            .AsNoTracking();

        query = (sortBy?.ToLowerInvariant()) switch
        {
            "name" or "nombre" => descending ? query.OrderByDescending(p => p.Nombre) : query.OrderBy(p => p.Nombre),
            "price" or "precio" => descending ? query.OrderByDescending(p => p.PrecioBase) : query.OrderBy(p => p.PrecioBase),
            _ => query.OrderBy(p => p.ProductoId)
        };

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }
}
