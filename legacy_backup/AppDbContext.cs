using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.Models;

namespace Pluxy3dBE.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Producto> Productos { get; set; }
        public DbSet<CarritoItem> CarritoItems { get; set; }
        // Puedes agregar más DbSet para Usuarios, Ordenes, etc.
    }
}
