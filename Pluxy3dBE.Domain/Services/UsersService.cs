using AutoMapper;
using Pluxy3dBE.DomainContracts.DTOs;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DalContracts;

namespace Pluxy3dBE.Domain.Services;

public class UsersService(IUsuarioRepository repo, IMapper mapper) : IUsersService
{
    public async Task<PagedResult<UsuarioDto>> GetUsersAsync(string? q, string? status, int page, int pageSize)
    {
        // Fallback implementation using generic repo until specialized query exists
        var all = await repo.GetAllAsync();
        var filtered = all.AsEnumerable();
        if (!string.IsNullOrWhiteSpace(q))
        {
            var term = q.Trim().ToLowerInvariant();
            filtered = filtered.Where(u => (u.Nombre ?? string.Empty).ToLowerInvariant().Contains(term)
                                        || (u.Apellido ?? string.Empty).ToLowerInvariant().Contains(term)
                                        || (u.Email ?? string.Empty).ToLowerInvariant().Contains(term));
        }
        if (!string.IsNullOrWhiteSpace(status))
        {
            switch (status.ToLowerInvariant())
            {
                case "activos": filtered = filtered.Where(u => u.Activo == true); break;
                case "inactivos": filtered = filtered.Where(u => u.Activo == false); break;
            }
        }
        var total = filtered.Count();
        if (page <= 0) page = 1;
        if (pageSize <= 0 || pageSize > 200) pageSize = 50;
        var items = filtered.Skip((page - 1) * pageSize).Take(pageSize).ToList();
        var dtos = mapper.Map<IEnumerable<UsuarioDto>>(items);
        return new PagedResult<UsuarioDto>
        {
            Items = dtos,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<UsuarioDto?> GetByIdAsync(Guid id)
    {
        var user = await repo.GetByUsuarioIdAsync(id);
        return user is null ? null : mapper.Map<UsuarioDto>(user);
    }
}
