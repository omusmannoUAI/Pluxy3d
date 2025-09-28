using Microsoft.EntityFrameworkCore.Storage;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Repository.Data;
using Pluxy3dBE.Repository.Repositories;

namespace Pluxy3dBE.Repository.Repositories;

/// <summary>
/// Implementación del Unit of Work pattern
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContextFromDb _context;
    private IDbContextTransaction? _transaction;
    
    // Lazy initialization para repositorios
    private IProductoRepository? _productos;
    private ICarritoRepository? _carrito;
    private IUsuarioRepository? _usuarios;
    private ICategoriaRepository? _categorias;

    public UnitOfWork(AppDbContextFromDb context)
    {
        _context = context;
    }

    public IProductoRepository Productos => 
        _productos ??= new ProductoRepository(_context);

    public ICarritoRepository Carrito => 
        _carrito ??= new CarritoRepository(_context);

    public IUsuarioRepository Usuarios => 
        _usuarios ??= new UsuarioRepository(_context);

    public ICategoriaRepository Categorias => 
        _categorias ??= new CategoriaRepository(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}