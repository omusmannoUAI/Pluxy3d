namespace Pluxy3dBE.Repositories.Cart;

public interface ICartRepository
{
    Task<IEnumerable<CarritoItemDto>> GetItemsAsync();
    Task<CarritoItemDto?> GetItemAsync(int id);
    Task<CarritoItemDto> AddItemAsync(CreateCartItemDto dto);
    Task<CarritoItemDto> UpdateQuantityAsync(int id, int quantity);
    Task DeleteItemAsync(int id);
    Task ClearAsync();
}

public record CreateCartItemDto(int ProductId, int Quantity);
public record CarritoItemDto(int Id, int ProductId, string Name, string? Description, decimal Price, int Quantity, string? Image);
