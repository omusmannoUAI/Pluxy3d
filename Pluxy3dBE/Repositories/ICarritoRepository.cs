using System.Collections.Generic;
using System.Threading.Tasks;
using Pluxy3dBE.Models;

namespace Pluxy3dBE.Repositories
{
    public interface ICarritoRepository
    {
        Task<IEnumerable<CarritoItem>> GetAllAsync();
        Task AddAsync(CarritoItem item);
        Task RemoveAsync(int productoId);
        Task SaveChangesAsync();
    }
}
