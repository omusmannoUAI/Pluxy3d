using System.Collections.Generic;
using System.Threading.Tasks;
using Pluxy3dBE.Models;

namespace Pluxy3dBE.Repositories
{
    public interface IProductoRepository
    {
        Task<IEnumerable<Producto>> GetAllAsync();
        Task<Producto> GetByIdAsync(int id);
        Task AddAsync(Producto producto);
        // Elimina un producto de la base de datos
        void Remove(Producto producto);
        Task SaveChangesAsync();
    }
}
