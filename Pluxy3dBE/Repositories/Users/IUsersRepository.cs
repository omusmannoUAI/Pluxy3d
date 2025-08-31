using Pluxy3dBE.Entities;

namespace Pluxy3dBE.Repositories.Users;

public interface IUsersRepository
{
    Task<(IEnumerable<Usuario> Items, int Total)> GetUsersAsync(string? query, string? status, int page, int pageSize);
    Task<Usuario?> GetByIdAsync(Guid id);
}
