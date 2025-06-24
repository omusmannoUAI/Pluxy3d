using System.Collections.Generic;
using System.Linq;
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

        public async Task<CarritoItem?> GetByIdAsync(int id)
        {
            return await _context.CarritoItems.FindAsync(id);
        }

        public async Task AddAsync(CarritoItem item)
        {
            await _context.CarritoItems.AddAsync(item);
        }        public Task UpdateAsync(CarritoItem item)
        {
            _context.CarritoItems.Update(item);
            return Task.CompletedTask;
        }

        public async Task RemoveAsync(int id)
        {
            var item = await _context.CarritoItems.FindAsync(id);
            if (item != null)
                _context.CarritoItems.Remove(item);
        }        public async Task ClearAsync()
        {
            try
            {
                // Use raw SQL to clear the table more efficiently
                await _context.Database.ExecuteSqlRawAsync("DELETE FROM CarritoItems");
            }
            catch (Exception)
            {
                // Fallback to the traditional approach
                var items = await _context.CarritoItems.ToListAsync();
                if (items.Any())
                {
                    _context.CarritoItems.RemoveRange(items);
                }
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
