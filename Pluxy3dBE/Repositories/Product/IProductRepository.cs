using Pluxy3dBE.Entities;

namespace Pluxy3dBE.Repositories.Product;

public interface IProductRepository
{
    Task<IEnumerable<Producto>> GetVisibleAsync();
    Task<Producto?> GetByIdAsync(int id);
    // Added: paginated fetch with sorting
    Task<(IEnumerable<Producto> Items, int Total)> GetVisiblePagedAsync(int page, int pageSize, string? sortBy, bool descending);
    // Added: category filter
    Task<(IEnumerable<Producto> Items, int Total)> GetVisiblePagedByCategoryAsync(int page, int pageSize, string? sortBy, bool descending, int categoryId);
}
