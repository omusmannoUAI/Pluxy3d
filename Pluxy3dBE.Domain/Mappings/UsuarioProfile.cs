using AutoMapper;
using Pluxy3dBE.DomainContracts.DTOs;
using Pluxy3dBE.Entities;

namespace Pluxy3dBE.Domain.Mappings;

public class UsuarioProfile : Profile
{
    public UsuarioProfile()
    {
        CreateMap<Usuario, UsuarioDto>()
            .ForMember(d => d.Id, o => o.MapFrom(s => 0))
            .ForMember(d => d.Nombre, o => o.MapFrom(s => (s.Nombre ?? "") + (string.IsNullOrWhiteSpace(s.Apellido) ? "" : " " + s.Apellido)))
            .ForMember(d => d.Email, o => o.MapFrom(s => s.Email ?? string.Empty))
            .ForMember(d => d.Telefono, o => o.Ignore())
            .ForMember(d => d.FechaRegistro, o => o.MapFrom(s => s.FechaRegistro ?? DateTime.MinValue))
            .ForMember(d => d.Activo, o => o.MapFrom(s => s.Activo ?? false))
            .ForMember(d => d.AvatarUrl, o => o.Ignore())
            .ForMember(d => d.Direcciones, o => o.Ignore());
    }
}
