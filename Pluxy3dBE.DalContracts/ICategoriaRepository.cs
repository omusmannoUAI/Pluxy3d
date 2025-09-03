namespace Pluxy3dBE.DalContracts;

public interface ICategoriaRepository
{
    Task<IEnumerable<CategorySummary>> GetSummariesAsync();
}
