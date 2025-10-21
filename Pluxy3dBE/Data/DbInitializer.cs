using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Pluxy3dBE.Repository.Data;
using Pluxy3dBE.Entities;
using Serilog;

namespace Pluxy3dBE.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(IServiceProvider services, CancellationToken ct = default)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContextFromDb>();

        // Si no hay categorías, insertar algunas por defecto
        try
        {
            if (!await db.CategoriasProductos.AnyAsync(ct))
            {
                // No insertar datos por defecto: el proyecto exige usar la base de datos real.
                Log.Warning("DbInitializer: no hay categorías en la base de datos. No se insertarán valores por defecto.");
            }
        }
        catch (Exception)
        {
            // No lanzar en el arranque si el seed falla; solo registrar en logs desde Serilog en Program.cs
        }
    }
}
