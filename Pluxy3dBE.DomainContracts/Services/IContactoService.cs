using Pluxy3dBE.DomainContracts.DTOs;
namespace Pluxy3dBE.DomainContracts.Services;

public interface IContactoService
{
    Task<int> CreateAsync(CreateMensajeDto dto);
    Task<IEnumerable<MensajeDto>> GetAllAsync();
    Task<bool> PatchReadAsync(PatchReadDto dto);
    Task<bool> DeleteAsync(int id);
}
