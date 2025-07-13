using AutoMapper;
using Pluxy3dBE.Entities;
using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.Domain.Mappings;

/// <summary>
/// Perfil de AutoMapper para productos
/// </summary>
public class ProductoProfile : Profile
{
    public ProductoProfile()
    {
        // Mapeo de entidad a DTO
        CreateMap<Producto, ProductoDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ProductoId))
            .ForMember(dest => dest.Precio, opt => opt.MapFrom(src => src.PrecioBase))
            .ForMember(dest => dest.Activo, opt => opt.MapFrom(src => src.Visible));

        // Mapeo de DTO de creación/actualización a entidad
        CreateMap<CreateUpdateProductoDto, Producto>()
            .ForMember(dest => dest.ProductoId, opt => opt.Ignore())
            .ForMember(dest => dest.PrecioBase, opt => opt.MapFrom(src => src.Precio))
            .ForMember(dest => dest.Visible, opt => opt.MapFrom(src => src.IsActive));

        // Mapeos para DTOs específicos
        CreateMap<CreateProductoDto, Producto>()
            .ForMember(dest => dest.ProductoId, opt => opt.Ignore())
            .ForMember(dest => dest.PrecioBase, opt => opt.MapFrom(src => src.Precio))
            .ForMember(dest => dest.Visible, opt => opt.MapFrom(src => src.IsActive));

        CreateMap<UpdateProductoDto, Producto>()
            .ForMember(dest => dest.ProductoId, opt => opt.Ignore())
            .ForMember(dest => dest.PrecioBase, opt => opt.MapFrom(src => src.Precio))
            .ForMember(dest => dest.Visible, opt => opt.MapFrom(src => src.IsActive))
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
