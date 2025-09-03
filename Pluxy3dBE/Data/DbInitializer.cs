using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(IServiceProvider services, CancellationToken ct = default)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContextFromDb>();

        // Ensure DB exists
        if (db.Database.IsSqlite() || db.Database.IsSqlServer())
        {
            // No-op; schema creation handled in Program
        }

        // Seed EstadosVenta if empty
        if (!await db.EstadosVenta.AnyAsync(ct))
        {
            db.EstadosVenta.AddRange(
                new Pluxy3dBE.Entities.EstadosVentum { Nombre = "Pendiente" },
                new Pluxy3dBE.Entities.EstadosVentum { Nombre = "Confirmada" },
                new Pluxy3dBE.Entities.EstadosVentum { Nombre = "En Proceso" },
                new Pluxy3dBE.Entities.EstadosVentum { Nombre = "Enviado" },
                new Pluxy3dBE.Entities.EstadosVentum { Nombre = "Entregado" },
                new Pluxy3dBE.Entities.EstadosVentum { Nombre = "Cancelada" }
            );
            await db.SaveChangesAsync(ct);
        }
    }
}
