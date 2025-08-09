using Microsoft.Extensions.Logging;
using Pluxy3dBE.Repositories.Cart;

namespace Pluxy3dBE.Services.Cart;

public interface ICartService
{
    Task<IEnumerable<CarritoItemDto>> GetAsync();
    Task<CarritoItemDto?> GetByIdAsync(int id);
    Task<CarritoItemDto> AddAsync(CreateCartItemDto dto);
    Task<CarritoItemDto> UpdateQuantityAsync(int id, int quantity);
    Task DeleteAsync(int id);
    Task ClearAsync();
}

public class CartService(ICartRepository repo, ILogger<CartService> logger) : ICartService
{
    public async Task<IEnumerable<CarritoItemDto>> GetAsync() => await repo.GetItemsAsync();
    public async Task<CarritoItemDto?> GetByIdAsync(int id) => await repo.GetItemAsync(id);
    public async Task<CarritoItemDto> AddAsync(CreateCartItemDto dto)
    {
        try { return await repo.AddItemAsync(dto); }
        catch (Exception ex) { logger.LogError(ex, "Error adding cart item"); throw; }
    }
    public async Task<CarritoItemDto> UpdateQuantityAsync(int id, int quantity)
    {
        try { return await repo.UpdateQuantityAsync(id, quantity); }
        catch (Exception ex) { logger.LogError(ex, "Error updating cart quantity"); throw; }
    }
    public async Task DeleteAsync(int id) => await repo.DeleteItemAsync(id);
    public async Task ClearAsync() => await repo.ClearAsync();
}
