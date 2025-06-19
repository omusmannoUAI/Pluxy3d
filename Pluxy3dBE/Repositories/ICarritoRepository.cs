using System.Collections.Generic;
using System.Threading.Tasks;
using Pluxy3dBE.Models;

namespace Pluxy3dBE.Repositories
{
    public interface ICarritoRepository
    {
        Task<IEnumerable<CarritoItem>> GetAllAsync();
        Task<CarritoItem?> GetByIdAsync(int id);
        Task AddAsync(CarritoItem item);
        Task UpdateAsync(CarritoItem item);
        Task RemoveAsync(int id);
        Task ClearAsync();
        Task SaveChangesAsync();
    }
}
