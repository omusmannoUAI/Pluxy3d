using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Pluxy3dBE.Repository.Data;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContextFromDb>
{
    public AppDbContextFromDb CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContextFromDb>();

        // Default to SQLite for design-time operations
        var cs = "Data Source=pluxy3d.db";
        optionsBuilder.UseSqlite(cs);

        return new AppDbContextFromDb(optionsBuilder.Options);
    }
}
