using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Entities;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Repository.Repositories;

/// <summary>
/// Implementación del repositorio de productos
/// </summary>
public class ProductoRepository : BaseRepository<Producto>, IProductoRepository
{
    public ProductoRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<Producto>> SearchAsync(string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
            return await GetActiveProductsAsync();

        return await _dbSet
            .Where(p => p.Activo && 
                       (p.Nombre.Contains(searchTerm) || 
                        p.Descripcion.Contains(searchTerm)))
            .OrderBy(p => p.Nombre)
            .ToListAsync();
    }

    public async Task<IEnumerable<Producto>> GetByCategoriaAsync(string categoria)
    {
        return await _dbSet
            .Where(p => p.Activo && p.Categoria.ToLower() == categoria.ToLower())
            .OrderBy(p => p.Nombre)
            .ToListAsync();
    }

    public async Task<IEnumerable<Producto>> GetByMarcaAsync(string marca)
    {
        return await _dbSet
            .Where(p => p.Activo && p.Marca.ToLower() == marca.ToLower())
            .OrderBy(p => p.Nombre)
            .ToListAsync();
    }

    public async Task<IEnumerable<Producto>> GetByPriceRangeAsync(decimal minPrice, decimal maxPrice)
    {
        return await _dbSet
            .Where(p => p.Activo && p.Precio >= minPrice && p.Precio <= maxPrice)
            .OrderBy(p => p.Precio)
            .ToListAsync();
    }

    public async Task<IEnumerable<Producto>> GetActiveProductsAsync()
    {
        return await _dbSet
            .Where(p => p.Activo)
            .OrderBy(p => p.Nombre)
            .ToListAsync();
    }

    public async Task<IEnumerable<Producto>> GetInStockProductsAsync()
    {
        return await _dbSet
            .Where(p => p.Activo && p.Stock > 0)
            .OrderBy(p => p.Nombre)
            .ToListAsync();
    }

    public async Task<bool> UpdateStockAsync(int productoId, int newStock)
    {
        var producto = await GetByIdAsync(productoId);
        if (producto == null)
            return false;

        producto.Stock = newStock;
        producto.FechaActualizacion = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<string>> GetCategoriasAsync()
    {
        return await _dbSet
            .Where(p => p.Activo)
            .Select(p => p.Categoria)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();
    }

    public async Task<IEnumerable<string>> GetMarcasAsync()
    {
        return await _dbSet
            .Where(p => p.Activo)
            .Select(p => p.Marca)
            .Distinct()
            .OrderBy(m => m)
            .ToListAsync();
    }

    public override async Task<Producto> UpdateAsync(Producto entity)
    {
        entity.FechaActualizacion = DateTime.UtcNow;
        return await base.UpdateAsync(entity);
    }
}
