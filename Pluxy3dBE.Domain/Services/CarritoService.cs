using AutoMapper;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.DomainContracts.DTOs;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.Entities;

namespace Pluxy3dBE.Domain.Services;

/// <summary>
/// Implementación del servicio de carrito
/// </summary>
public class CarritoService : ICarritoService
{
    private readonly ICarritoRepository _carritoRepository;
    private readonly IProductoRepository _productoRepository;
    private readonly IMapper _mapper;

    public CarritoService(
        ICarritoRepository carritoRepository,
        IProductoRepository productoRepository,
        IMapper mapper)
    {
        _carritoRepository = carritoRepository;
        _productoRepository = productoRepository;
        _mapper = mapper;
    }

    public async Task<CarritoDto> GetCarritoAsync(string? usuarioId, string? sessionId)
    {
        IEnumerable<CarritoItem> items;

        if (!string.IsNullOrEmpty(usuarioId))
        {
            items = await _carritoRepository.GetByUsuarioIdAsync(usuarioId);
        }
        else if (!string.IsNullOrEmpty(sessionId))
        {
            items = await _carritoRepository.GetBySessionIdAsync(sessionId);
        }
        else
        {
            items = new List<CarritoItem>();
        }

        var itemsDto = _mapper.Map<List<CarritoItemDto>>(items);

        return new CarritoDto
        {
            Items = itemsDto,
            Total = itemsDto.Sum(i => i.PrecioTotal),
            TotalItems = itemsDto.Sum(i => i.Cantidad)
        };
    }

    public async Task<CarritoItemDto> AddItemToCarritoAsync(AddCarritoItemDto addItemDto)
    {
        // Validar que el producto existe
        var producto = await _productoRepository.GetByIdAsync(addItemDto.ImpresoraId);
        if (producto == null)
            throw new ArgumentException("El producto no existe");

        if (!producto.Visible.GetValueOrDefault())
            throw new ArgumentException("El producto no está disponible");

        if (producto.Stock < addItemDto.Cantidad)
            throw new ArgumentException("No hay suficiente stock disponible");

        // Verificar si ya existe el item en el carrito
        var existingItem = await _carritoRepository.GetItemAsync(
            addItemDto.ImpresoraId,
            addItemDto.UsuarioId,
            addItemDto.SessionId);

        if (existingItem != null)
        {
            // Actualizar cantidad
            var newQuantity = existingItem.Cantidad + addItemDto.Cantidad;
            if (producto.Stock < newQuantity)
                throw new ArgumentException("No hay suficiente stock disponible");

            existingItem.Cantidad = newQuantity;
            await _carritoRepository.UpdateAsync(existingItem);

            return _mapper.Map<CarritoItemDto>(existingItem);
        }
        else
        {
            var carritoItem = _mapper.Map<CarritoItem>(addItemDto);

            var addedItem = await _carritoRepository.AddAsync(carritoItem);

            return _mapper.Map<CarritoItemDto>(addedItem);
        }
    }

    public async Task<CarritoItemDto?> GetItemByIdAsync(int itemId)
    {
        var item = await _carritoRepository.GetByIdAsync(itemId);
        return item is null ? null : _mapper.Map<CarritoItemDto>(item);
    }

    public async Task<bool> UpdateItemCantidadAsync(UpdateCarritoItemDto updateDto)
    {
        var item = await _carritoRepository.GetByIdAsync(updateDto.ItemId);
        if (item == null)
            return false;

        // Validar stock si es necesario
        if (updateDto.NuevaCantidad > 0)
        {
            // Validación de stock puede implementarse si es requerida más adelante.
        }

        return await _carritoRepository.UpdateCantidadAsync(updateDto.ItemId, updateDto.NuevaCantidad);
    }

    public async Task<bool> RemoveItemFromCarritoAsync(int itemId)
    {
        return await _carritoRepository.DeleteAsync(itemId);
    }

    public async Task<bool> ClearCarritoAsync(string? usuarioId, string? sessionId)
    {
        return await _carritoRepository.ClearCarritoAsync(usuarioId, sessionId);
    }

    public async Task<decimal> GetCarritoTotalAsync(string? usuarioId, string? sessionId)
    {
        return await _carritoRepository.GetCarritoTotalAsync(usuarioId, sessionId);
    }

    public async Task<int> GetCarritoItemCountAsync(string? usuarioId, string? sessionId)
    {
        return await _carritoRepository.GetCarritoItemCountAsync(usuarioId, sessionId);
    }

    public async Task<bool> TransferSessionCartToUserAsync(TransferCarritoDto transferDto)
    {
        return await _carritoRepository.TransferSessionCartToUserAsync(transferDto.SessionId, transferDto.UsuarioId);
    }
}
