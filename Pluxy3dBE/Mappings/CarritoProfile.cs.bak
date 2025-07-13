using AutoMapper;
using Pluxy3dBE.DTOs;
using Pluxy3dBE.Models;

namespace Pluxy3dBE.Mappings
{
    public class CarritoProfile : Profile
    {
        public CarritoProfile()
        {
            CreateMap<CarritoItem, CartItemDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.ProductoId))
                .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Cantidad));
            CreateMap<CartItemDto, CarritoItem>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.ProductoId, opt => opt.MapFrom(src => src.ProductId))
                .ForMember(dest => dest.Cantidad, opt => opt.MapFrom(src => src.Quantity));
        }
    }
}
