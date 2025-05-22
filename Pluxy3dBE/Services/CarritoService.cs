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
        }

        public async Task<IEnumerable<CartItemDto>> GetAllAsync()
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
                    Description = product?.GetType().GetProperty("Descripcion") != null ? (string)(product?.GetType().GetProperty("Descripcion")?.GetValue(product) ?? "") : string.Empty,
                    Image = product?.Image ?? string.Empty,
                    Price = product?.Precio ?? 0,
                    Quantity = item.Cantidad,
                    Discount = null // Add discount logic if needed
                };
            });
            return result;
        }

        public async Task<CartItemDto> AddItemAsync(CartItemDto itemDto)
        {
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
                Description = product?.GetType().GetProperty("Descripcion") != null ? (string)(product?.GetType().GetProperty("Descripcion")?.GetValue(product) ?? "") : string.Empty,
                Image = product?.GetType().GetProperty("Imagen") != null ? (string)(product?.GetType().GetProperty("Imagen")?.GetValue(product) ?? "") : string.Empty,
                Price = product?.Precio ?? 0,
                Quantity = item.Cantidad,
                Discount = null
            };
        }

        public async Task<bool> RemoveItemAsync(int id)
        {
            await _repo.RemoveAsync(id);
            await _repo.SaveChangesAsync();
            return true;
        }
    }
}
