using Pluxy3dBE.DalContracts;

namespace Pluxy3dBE.DalContracts;

/// <summary>
/// Unit of Work pattern para coordinar transacciones entre múltiples repositorios
/// </summary>
public interface IUnitOfWork : IDisposable
{
    IProductoRepository Productos { get; }
    ICarritoRepository Carrito { get; }
    IUsuarioRepository Usuarios { get; }
    ICategoriaRepository Categorias { get; }
    
    /// <summary>
    /// Guarda todos los cambios pendientes en una sola transacción
    /// </summary>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Inicia una nueva transacción explícita
    /// </summary>
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Confirma la transacción actual
    /// </summary>
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    
    /// <summary>
    /// Cancela la transacción actual
    /// </summary>
    Task RollbackTransactionAsync();
}