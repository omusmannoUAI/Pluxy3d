using AutoMapper;
using Pluxy3dBE.Entities;
using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.Domain.Mappings;

/// <summary>
/// Perfil de AutoMapper para carrito
/// </summary>
public class CarritoProfile : Profile
{
    public CarritoProfile()
    {
        // Mapeo de entidad a DTO
        CreateMap<CarritoItem, CarritoItemDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ItemId))
            .ForMember(dest => dest.ProductoNombre, opt => opt.MapFrom(src => src.Impresora!.Producto!.Nombre))
            .ForMember(dest => dest.ProductoImage, opt => opt.MapFrom(src => src.Impresora!.Producto!.Image))
            .ForMember(dest => dest.PrecioTotal, opt => opt.MapFrom(src => src.Cantidad * src.Impresora!.TotalFinal));

        // Mapeo de DTO de agregar item a entidad
        CreateMap<AddCarritoItemDto, CarritoItem>()
            .ForMember(dest => dest.ItemId, opt => opt.Ignore())
            .ForMember(dest => dest.ImpresoraId, opt => opt.MapFrom(src => src.ProductoId)) // Asumiendo que se mapea a ImpresoraId
            .ForMember(dest => dest.Impresora, opt => opt.Ignore());
    }
}
