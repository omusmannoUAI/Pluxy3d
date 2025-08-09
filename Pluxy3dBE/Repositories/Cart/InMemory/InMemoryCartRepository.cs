using System.Collections.Concurrent;

namespace Pluxy3dBE.Repositories.Cart.InMemory;

public class InMemoryCartRepository : ICartRepository
{
    private static readonly ConcurrentDictionary<int, CarritoItemDto> _items = new();
    private static int _id = 1;

    public Task<IEnumerable<CarritoItemDto>> GetItemsAsync()
        => Task.FromResult(_items.Values.AsEnumerable());

    public Task<CarritoItemDto?> GetItemAsync(int id)
        => Task.FromResult(_items.GetValueOrDefault(id));

    public Task<CarritoItemDto> AddItemAsync(CreateCartItemDto dto)
    {
        var id = Interlocked.Increment(ref _id);
        var item = new CarritoItemDto(id, dto.ProductId, $"Producto {dto.ProductId}", null, 0m, dto.Quantity, null);
        _items[id] = item;
        return Task.FromResult(item);
    }

    public Task<CarritoItemDto> UpdateQuantityAsync(int id, int quantity)
    {
        if (_items.TryGetValue(id, out var existing))
        {
            var updated = existing with { Quantity = quantity };
            _items[id] = updated;
            return Task.FromResult(updated);
        }
        throw new KeyNotFoundException($"Item {id} not found");
    }

    public Task DeleteItemAsync(int id)
    {
        _items.TryRemove(id, out _);
        return Task.CompletedTask;
    }

    public Task ClearAsync()
    {
        _items.Clear();
        return Task.CompletedTask;
    }
}
