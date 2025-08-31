using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Entities;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Repository.Repositories;

public class UsuarioRepository(AppDbContextFromDb db) : IUsuarioRepository
{
    public async Task<Usuario?> GetByEmailAsync(string email)
        => await db.Usuarios.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<bool> ExistsByEmailAsync(string email)
        => await db.Usuarios.AnyAsync(u => u.Email == email);

    public async Task<bool> UpdateLastAccessAsync(int usuarioId)
    {
        // No LastAccess field in entity; placeholder no-op
        return await Task.FromResult(true);
    }

    public async Task<bool> UpdateEmailVerificationAsync(int usuarioId, bool verified)
    {
        // No email verification field in entity; placeholder no-op
        return await Task.FromResult(true);
    }

    public async Task<IEnumerable<Usuario>> GetActiveUsersAsync()
        => await db.Usuarios.Where(u => u.Activo == true).ToListAsync();

    public async Task<bool> UpdatePasswordAsync(int usuarioId, string passwordHash, string salt)
    {
        // No salt field; set hash only if entity has it
        var u = await db.Usuarios.FindAsync(usuarioId);
        if (u == null) return false;
        u.PasswordHash = passwordHash;
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<Usuario?> GetByUsuarioIdAsync(Guid usuarioId)
        => await db.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.UsuarioId == usuarioId);

    public async Task<IEnumerable<Usuario>> GetByRoleAsync(int roleId)
        => await db.Usuarios.Where(u => u.Rols.Any(r => r.RolId == roleId)).ToListAsync();

    // IRepository<T>
    public async Task<IEnumerable<Usuario>> GetAllAsync() => await db.Usuarios.AsNoTracking().ToListAsync();

    public async Task<Usuario?> GetByIdAsync(int id)
        => await db.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.UsuarioId == new Guid());

    public async Task<Usuario> AddAsync(Usuario entity)
    {
        if (entity.UsuarioId == Guid.Empty) entity.UsuarioId = Guid.NewGuid();
        entity.FechaRegistro ??= DateTime.UtcNow;
        db.Usuarios.Add(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    public async Task<Usuario> UpdateAsync(Usuario entity)
    {
        db.Usuarios.Update(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        // No int PK; not supported
        return await Task.FromResult(false);
    }

    public async Task<bool> ExistsAsync(int id)
        => await Task.FromResult(false);

    public async Task<(IEnumerable<Usuario> Items, int TotalCount)> GetPagedAsync(int page, int pageSize)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0 || pageSize > 200) pageSize = 50;
        var q = db.Usuarios.AsNoTracking().OrderBy(u => u.Nombre).ThenBy(u => u.Apellido);
        var total = await q.CountAsync();
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (items, total);
    }
}
