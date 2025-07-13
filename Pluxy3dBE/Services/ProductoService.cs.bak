using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Pluxy3dBE.DTOs;
using Pluxy3dBE.Models;
using Pluxy3dBE.Repositories;

namespace Pluxy3dBE.Services
{
    public class ProductoService
    {
        private readonly IProductoRepository _repo;
        private readonly IMapper _mapper;
        public ProductoService(IProductoRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ProductoDto>> GetAllAsync()
        {
            var productos = await _repo.GetAllAsync();
            return productos.Select(p => new ProductoDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Precio = p.Precio,
                Image = p.Image
            });
        }

        public async Task<ProductoDto> GetByIdAsync(int id)
        {
            var producto = await _repo.GetByIdAsync(id);
            return _mapper.Map<ProductoDto>(producto);
        }

        public async Task<ProductoDto> CreateAsync(ProductoDto dto)
        {
            var producto = _mapper.Map<Producto>(dto);
            await _repo.AddAsync(producto);
            await _repo.SaveChangesAsync();
            return _mapper.Map<ProductoDto>(producto);
        }

        public async Task<ProductoDto> UpdateAsync(int id, ProductoDto dto)
        {
            var producto = await _repo.GetByIdAsync(id);
            if (producto == null) return null;
            producto.Nombre = dto.Nombre;
            producto.Precio = dto.Precio;
            await _repo.SaveChangesAsync();
            return _mapper.Map<ProductoDto>(producto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var producto = await _repo.GetByIdAsync(id);
            if (producto == null) return false;
            _repo.Remove(producto);
            await _repo.SaveChangesAsync();
            return true;
        }
    }
}
