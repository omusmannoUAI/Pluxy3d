using Pluxy3dBE.DomainContracts.DTOs;

namespace Pluxy3dBE.DomainContracts.Services;

public interface ICategoriaService
{
    Task<IEnumerable<CategoriaDto>> GetCategoriasAsync();
}
