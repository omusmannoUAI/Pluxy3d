using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.DomainContracts.Services;

public interface IUsersService
{
    Task<PagedResult<UsuarioDto>> GetUsersAsync(string? q, string? status, int page, int pageSize);
    Task<UsuarioDto?> GetByIdAsync(Guid id);
}
