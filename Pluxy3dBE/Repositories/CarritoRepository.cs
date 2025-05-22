using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.Data;
using Pluxy3dBE.Models;

namespace Pluxy3dBE.Repositories
{
    public class CarritoRepository : ICarritoRepository
    {
        private readonly AppDbContext _context;
        public CarritoRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CarritoItem>> GetAllAsync()
        {
            return await _context.CarritoItems.ToListAsync();
        }

        public async Task AddAsync(CarritoItem item)
        {
            await _context.CarritoItems.AddAsync(item);
        }

        public async Task RemoveAsync(int id)
        {
            var item = await _context.CarritoItems.FindAsync(id);
            if (item != null)
                _context.CarritoItems.Remove(item);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
