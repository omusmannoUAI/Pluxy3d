using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Repository.Repositories;

public class CategoriaRepository(AppDbContextFromDb db) : ICategoriaRepository
{
    public async Task<IEnumerable<CategorySummary>> GetSummariesAsync()
    {
        return await db.CategoriasProductos
            .AsNoTracking()
            .Select(c => new CategorySummary
            {
                Id = c.CategoriaId,
                Nombre = c.Nombre,
                Descripcion = c.Descripcion,
                Count = c.Productos.Count
            })
            .ToListAsync();
    }
}
