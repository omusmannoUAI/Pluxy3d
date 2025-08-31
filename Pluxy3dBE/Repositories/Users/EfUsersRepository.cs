using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.Entities;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Repositories.Users;

public class EfUsersRepository(AppDbContextFromDb db) : IUsersRepository
{
    public async Task<(IEnumerable<Usuario> Items, int Total)> GetUsersAsync(string? query, string? status, int page, int pageSize)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0 || pageSize > 200) pageSize = 50;

        var q = db.Usuarios.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(query))
        {
            var term = query.Trim().ToLower();
            q = q.Where(u => (u.Nombre ?? "").ToLower().Contains(term)
                          || (u.Apellido ?? "").ToLower().Contains(term)
                          || (u.Email ?? "").ToLower().Contains(term));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            switch (status.ToLowerInvariant())
            {
                case "activos":
                    q = q.Where(u => u.Activo == true);
                    break;
                case "inactivos":
                    q = q.Where(u => u.Activo == false);
                    break;
            }
        }

        q = q.OrderBy(u => u.Nombre).ThenBy(u => u.Apellido);

        var total = await q.CountAsync();
        var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return (items, total);
    }

    public async Task<Usuario?> GetByIdAsync(Guid id)
        => await db.Usuarios.AsNoTracking().FirstOrDefaultAsync(u => u.UsuarioId == id);
}
