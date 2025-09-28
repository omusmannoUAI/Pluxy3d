using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Repository.Repositories;

/// <summary>
/// Repositorio base genérico que implementa operaciones CRUD comunes
/// Elimina duplicación de código en repositorios específicos
/// </summary>
/// <typeparam name="T">Tipo de entidad</typeparam>
public abstract class BaseRepository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContextFromDb _context;
    protected readonly DbSet<T> _dbSet;

    protected BaseRepository(AppDbContextFromDb context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await ApplyIncludes(_dbSet)
            .AsNoTracking()
            .ToListAsync();
    }

    public virtual async Task<T?> GetByIdAsync(int id)
    {
        // Para entidades con diferentes nombres de clave primaria
        var keyProperty = GetKeyPropertyName();
        return await ApplyIncludes(_dbSet)
            .AsNoTracking()
            .FirstOrDefaultAsync(e => EF.Property<int>(e, keyProperty) == id);
    }

    public virtual async Task<T> AddAsync(T entity)
    {
        _dbSet.Add(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<T> UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<bool> DeleteAsync(int id)
    {
        var keyProperty = GetKeyPropertyName();
        var entity = await _dbSet
            .FirstOrDefaultAsync(e => EF.Property<int>(e, keyProperty) == id);
        
        if (entity == null) return false;
        
        _dbSet.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public virtual async Task<bool> ExistsAsync(int id)
    {
        var keyProperty = GetKeyPropertyName();
        return await _dbSet
            .AnyAsync(e => EF.Property<int>(e, keyProperty) == id);
    }

    public virtual async Task<(IEnumerable<T> Items, int TotalCount)> GetPagedAsync(int page, int pageSize)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0 || pageSize > 200) pageSize = 20;

        var query = ApplyIncludes(_dbSet).AsNoTracking();
        var total = await query.CountAsync();
        
        var items = await ApplyDefaultOrdering(query)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    /// <summary>
    /// Aplica includes específicos para cada entidad
    /// Override en repositorios específicos para incluir relaciones
    /// </summary>
    protected virtual IQueryable<T> ApplyIncludes(IQueryable<T> query)
    {
        return query;
    }

    /// <summary>
    /// Aplica ordenamiento por defecto para paginación
    /// Override en repositorios específicos si necesario
    /// </summary>
    protected virtual IQueryable<T> ApplyDefaultOrdering(IQueryable<T> query)
    {
        var keyProperty = GetKeyPropertyName();
        return query.OrderBy(e => EF.Property<int>(e, keyProperty));
    }

    /// <summary>
    /// Obtiene el nombre de la propiedad clave primaria
    /// Override en repositorios específicos si la PK no es "Id"
    /// </summary>
    protected virtual string GetKeyPropertyName()
    {
        // Default para entidades que usan "Id"
        return "Id";
    }
}
