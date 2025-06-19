using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Pluxy3dBE.DTOs;
using Pluxy3dBE.Models;
using Pluxy3dBE.Repositories;

namespace Pluxy3dBE.Services
{
    public class CarritoService
    {
        private readonly ICarritoRepository _repo;
        private readonly IMapper _mapper;
        private readonly IProductoRepository _productoRepository;
        public CarritoService(ICarritoRepository repo, IMapper mapper, IProductoRepository productoRepository)
        {
            _repo = repo;
            _mapper = mapper;
            _productoRepository = productoRepository;
        }        public async Task<IEnumerable<CartItemDto>> GetAllAsync()
        {
            var items = await _repo.GetAllAsync();
            var products = await _productoRepository.GetAllAsync();
            var result = items.Select(item =>
            {
                var product = products.FirstOrDefault(p => p.Id == item.ProductoId);
                return new CartItemDto
                {
                    Id = item.Id,
                    ProductId = item.ProductoId,
                    Name = product?.Nombre ?? string.Empty,
                    Description = product?.Descripcion ?? string.Empty,
                    Image = product?.Image ?? string.Empty,
                    Price = product?.Precio ?? 0,
                    Quantity = item.Cantidad,
                    Discount = null // Add discount logic if needed
                };
            });
            return result;
        }public async Task<CartItemDto> AddItemAsync(CartItemDto itemDto)
        {
            // Check if item already exists in cart
            var existingItems = await _repo.GetAllAsync();
            var existingItem = existingItems.FirstOrDefault(x => x.ProductoId == itemDto.ProductId);
            
            if (existingItem != null)
            {
                // Update existing item quantity
                existingItem.Cantidad += itemDto.Quantity;
                await _repo.UpdateAsync(existingItem);
                await _repo.SaveChangesAsync();
                
                // Return enriched CartItemDto
                var products = await _productoRepository.GetAllAsync();
                var product = products.FirstOrDefault(p => p.Id == existingItem.ProductoId);                return new CartItemDto
                {
                    Id = existingItem.Id,
                    ProductId = existingItem.ProductoId,
                    Name = product?.Nombre ?? string.Empty,
                    Description = product?.Descripcion ?? string.Empty,
                    Image = product?.Image ?? string.Empty,
                    Price = product?.Precio ?? 0,
                    Quantity = existingItem.Cantidad,
                    Discount = null
                };
            }
            else
            {
                // Add new item
                var item = new CarritoItem
                {
                    ProductoId = itemDto.ProductId,
                    Cantidad = itemDto.Quantity
                };
                await _repo.AddAsync(item);
                await _repo.SaveChangesAsync();
                
                // Return enriched CartItemDto
                var products = await _productoRepository.GetAllAsync();
                var product = products.FirstOrDefault(p => p.Id == item.ProductoId);
                return new CartItemDto
                {
                    Id = item.Id,
                    ProductId = item.ProductoId,
                    Name = product?.Nombre ?? string.Empty,
                    Description = product?.Descripcion ?? string.Empty,
                    Image = product?.Image ?? string.Empty,
                    Price = product?.Precio ?? 0,
                    Quantity = item.Cantidad,
                    Discount = null
                };
            }
        }

        public async Task<CartItemDto?> UpdateItemAsync(int id, int quantity)
        {
            var item = await _repo.GetByIdAsync(id);
            if (item == null) return null;

            item.Cantidad = quantity;
            await _repo.UpdateAsync(item);
            await _repo.SaveChangesAsync();

            // Return enriched CartItemDto
            var products = await _productoRepository.GetAllAsync();
            var product = products.FirstOrDefault(p => p.Id == item.ProductoId);            return new CartItemDto
            {
                Id = item.Id,
                ProductId = item.ProductoId,
                Name = product?.Nombre ?? string.Empty,
                Description = product?.Descripcion ?? string.Empty,
                Image = product?.Image ?? string.Empty,
                Price = product?.Precio ?? 0,
                Quantity = item.Cantidad,
                Discount = null
            };
        }        public async Task<bool> RemoveItemAsync(int id)
        {
            await _repo.RemoveAsync(id);
            await _repo.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ClearCartAsync()
        {
            await _repo.ClearAsync();
            await _repo.SaveChangesAsync();
            return true;
        }
    }
}
