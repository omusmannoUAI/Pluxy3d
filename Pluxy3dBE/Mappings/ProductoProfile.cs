using AutoMapper;
using Pluxy3dBE.DTOs;
using Pluxy3dBE.Models;

namespace Pluxy3dBE.Mappings
{
    public class ProductoProfile : Profile
    {
        public ProductoProfile()
        {
            CreateMap<Producto, ProductoDto>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image));
            CreateMap<ProductoDto, Producto>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Image));
        }
    }
}
