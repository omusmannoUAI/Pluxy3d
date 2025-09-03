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

    public async Task<FileExportDto> ExportCsvAsync(string? q, string? status)
    {
        var result = await GetUsersAsync(q, status, 1, int.MaxValue);
        var items = result.Items;

        var sb = new System.Text.StringBuilder();
        sb.AppendLine("Id,Nombre,Email,Activo,Rol,Pedidos,TotalGastado,Since,UltimoAcceso");
        foreach (var u in items)
        {
            sb.AppendLine(string.Join(',',
                Escape(u.Id.ToString()),
                Escape(u.Nombre),
                Escape(u.Email),
                u.Activo ? "Activo" : "Inactivo",
                "customer",
                0,
                "$0",
                Escape(u.FechaRegistro.ToString("yyyy-MM-dd")),
                string.Empty
            ));
        }

        return new FileExportDto
        {
            Bytes = System.Text.Encoding.UTF8.GetBytes(sb.ToString()),
            ContentType = "text/csv; charset=utf-8",
            FileName = $"usuarios_{DateTime.UtcNow:yyyyMMdd}.csv"
        };

        static string Escape(string? s)
        {
            s ??= string.Empty;
            if (s.Contains('"') || s.Contains(',') || s.Contains('\n'))
            {
                s = '"' + s.Replace("\"", "\"\"") + '"';
            }
            return s;
        }
    }
}
