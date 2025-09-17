using Pluxy3dBE.Entities;
using Pluxy3dBE.DalContracts;

namespace Pluxy3dBE.DomainContracts.Commands;

/// <summary>
/// Interfaz base para comandos
/// </summary>
public interface ICommand<TResult>
{
    string CommandName { get; }
}

/// <summary>
/// Interfaz para manejadores de comandos
/// </summary>
public interface ICommandHandler<TCommand, TResult> where TCommand : ICommand<TResult>
{
    Task<TResult> HandleAsync(TCommand command);
}

/// <summary>
/// Resultado base para comandos
/// </summary>
public class CommandResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public Dictionary<string, object> Data { get; set; } = new();
    public DateTime ExecutedAt { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Resultado para comandos de carrito
/// </summary>
public class CarritoCommandResult : CommandResult
{
    public int? CarritoId { get; set; }
    public int? ItemId { get; set; }
    public decimal? TotalAmount { get; set; }
    public int? TotalItems { get; set; }
}

// ============================
// COMANDOS DE CARRITO
// ============================

/// <summary>
/// Comando para agregar item al carrito
/// </summary>
public class AddItemToCarritoCommand : ICommand<CarritoCommandResult>
{
    public string CommandName => "AddItemToCarrito";
    public int ImpresoraId { get; set; }
    public int Cantidad { get; set; }
    public string? UsuarioId { get; set; }
    public string? SessionId { get; set; }
    public decimal PrecioUnitario { get; set; }
}

/// <summary>
/// Comando para actualizar cantidad de item
/// </summary>
public class UpdateCarritoItemCommand : ICommand<CarritoCommandResult>
{
    public string CommandName => "UpdateCarritoItem";
    public int ItemId { get; set; }
    public int NuevaCantidad { get; set; }
    public string? UsuarioId { get; set; }
}

/// <summary>
/// Comando para remover item del carrito
/// </summary>
public class RemoveItemFromCarritoCommand : ICommand<CarritoCommandResult>
{
    public string CommandName => "RemoveItemFromCarrito";
    public int ItemId { get; set; }
    public string? UsuarioId { get; set; }
}

/// <summary>
/// Comando para limpiar carrito
/// </summary>
public class ClearCarritoCommand : ICommand<CarritoCommandResult>
{
    public string CommandName => "ClearCarrito";
    public string? UsuarioId { get; set; }
    public string? SessionId { get; set; }
}

/// <summary>
/// Comando para transferir carrito de sesión a usuario
/// </summary>
public class TransferCarritoCommand : ICommand<CarritoCommandResult>
{
    public string CommandName => "TransferCarrito";
    public string SessionId { get; set; } = string.Empty;
    public string UsuarioId { get; set; } = string.Empty;
}

// ============================
// MANEJADORES DE COMANDOS
// ============================

/// <summary>
/// Manejador para agregar items al carrito
/// </summary>
public class AddItemToCarritoHandler : ICommandHandler<AddItemToCarritoCommand, CarritoCommandResult>
{
    private readonly ICarritoMainRepository _carritoMainRepository;
    private readonly ICarritoRepository _carritoItemRepository;
    private readonly IProductoRepository _productoRepository;

    public AddItemToCarritoHandler(
        ICarritoMainRepository carritoMainRepository,
        ICarritoRepository carritoItemRepository,
        IProductoRepository productoRepository)
    {
        _carritoMainRepository = carritoMainRepository;
        _carritoItemRepository = carritoItemRepository;
        _productoRepository = productoRepository;
    }

    public async Task<CarritoCommandResult> HandleAsync(AddItemToCarritoCommand command)
    {
        try
        {
            // Validar que el producto existe
            var producto = await _productoRepository.GetByIdAsync(command.ImpresoraId);
            if (producto == null)
            {
                return new CarritoCommandResult
                {
                    Success = false,
                    Message = "Producto no encontrado"
                };
            }

            // Verificar stock disponible
            if (producto.Stock < command.Cantidad)
            {
                return new CarritoCommandResult
                {
                    Success = false,
                    Message = "Stock insuficiente"
                };
            }

            // Obtener o crear carrito
            var carrito = await GetOrCreateCarritoAsync(command.UsuarioId, command.SessionId);

            // Verificar si el item ya existe en el carrito
            var existingItem = carrito.CarritoItems.FirstOrDefault(i => i.ImpresoraId == command.ImpresoraId);

            if (existingItem != null)
            {
                // Actualizar cantidad existente
                existingItem.Cantidad += command.Cantidad;
            }
            else
            {
                // Agregar nuevo item
                var newItem = new CarritoItem
                {
                    CarritoId = carrito.CarritoId,
                    ImpresoraId = command.ImpresoraId,
                    Cantidad = command.Cantidad
                };
                carrito.CarritoItems.Add(newItem);
            }

            carrito.FechaActualizacion = DateTime.UtcNow;
            await _carritoMainRepository.UpdateAsync(carrito);

            var totalItems = carrito.CarritoItems.Sum(i => i.Cantidad);
            var totalAmount = carrito.CarritoItems.Sum(i => i.Cantidad * command.PrecioUnitario);

            return new CarritoCommandResult
            {
                Success = true,
                Message = "Item agregado al carrito exitosamente",
                CarritoId = carrito.CarritoId,
                TotalItems = totalItems,
                TotalAmount = totalAmount
            };
        }
        catch (Exception ex)
        {
            return new CarritoCommandResult
            {
                Success = false,
                Message = $"Error al agregar item al carrito: {ex.Message}"
            };
        }
    }

    private async Task<Carrito> GetOrCreateCarritoAsync(string? usuarioId, string? sessionId)
    {
        Carrito? carrito = null;

        if (!string.IsNullOrEmpty(usuarioId) && Guid.TryParse(usuarioId, out var userGuid))
        {
            carrito = await _carritoMainRepository.GetCarritoByUsuarioAsync(userGuid);
        }

        if (carrito == null)
        {
            carrito = new Carrito
            {
                UsuarioId = !string.IsNullOrEmpty(usuarioId) && Guid.TryParse(usuarioId, out var guid) ? guid : null,
                FechaActualizacion = DateTime.UtcNow,
                CarritoItems = new List<CarritoItem>()
            };
            await _carritoMainRepository.AddAsync(carrito);
        }

        return carrito;
    }
}

/// <summary>
/// Manejador para actualizar items del carrito
/// </summary>
public class UpdateCarritoItemHandler : ICommandHandler<UpdateCarritoItemCommand, CarritoCommandResult>
{
    private readonly ICarritoRepository _carritoRepository;

    public UpdateCarritoItemHandler(ICarritoRepository carritoRepository)
    {
        _carritoRepository = carritoRepository;
    }

    public async Task<CarritoCommandResult> HandleAsync(UpdateCarritoItemCommand command)
    {
        try
        {
            var item = await _carritoRepository.GetByIdAsync(command.ItemId);
            if (item == null)
            {
                return new CarritoCommandResult
                {
                    Success = false,
                    Message = "Item del carrito no encontrado"
                };
            }

            if (command.NuevaCantidad <= 0)
            {
                await _carritoRepository.DeleteAsync(command.ItemId);
                return new CarritoCommandResult
                {
                    Success = true,
                    Message = "Item removido del carrito",
                    ItemId = command.ItemId
                };
            }

            item.Cantidad = command.NuevaCantidad;
            await _carritoRepository.UpdateAsync(item);

            return new CarritoCommandResult
            {
                Success = true,
                Message = "Cantidad actualizada exitosamente",
                ItemId = command.ItemId
            };
        }
        catch (Exception ex)
        {
            return new CarritoCommandResult
            {
                Success = false,
                Message = $"Error al actualizar item: {ex.Message}"
            };
        }
    }
}

/// <summary>
/// Manejador para remover items del carrito
/// </summary>
public class RemoveItemFromCarritoHandler : ICommandHandler<RemoveItemFromCarritoCommand, CarritoCommandResult>
{
    private readonly ICarritoRepository _carritoRepository;

    public RemoveItemFromCarritoHandler(ICarritoRepository carritoRepository)
    {
        _carritoRepository = carritoRepository;
    }

    public async Task<CarritoCommandResult> HandleAsync(RemoveItemFromCarritoCommand command)
    {
        try
        {
            var item = await _carritoRepository.GetByIdAsync(command.ItemId);
            if (item == null)
            {
                return new CarritoCommandResult
                {
                    Success = false,
                    Message = "Item del carrito no encontrado"
                };
            }

            await _carritoRepository.DeleteAsync(command.ItemId);

            return new CarritoCommandResult
            {
                Success = true,
                Message = "Item removido del carrito exitosamente",
                ItemId = command.ItemId
            };
        }
        catch (Exception ex)
        {
            return new CarritoCommandResult
            {
                Success = false,
                Message = $"Error al remover item: {ex.Message}"
            };
        }
    }
}

/// <summary>
/// Despachador de comandos
/// </summary>
public interface ICommandDispatcher
{
    Task<TResult> DispatchAsync<TResult>(ICommand<TResult> command);
}

public class CommandDispatcher : ICommandDispatcher
{
    private readonly IServiceProvider _serviceProvider;

    public CommandDispatcher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task<TResult> DispatchAsync<TResult>(ICommand<TResult> command)
    {
        var commandType = command.GetType();
        var handlerType = typeof(ICommandHandler<,>).MakeGenericType(commandType, typeof(TResult));

        var handler = _serviceProvider.GetService(handlerType);
        if (handler == null)
        {
            throw new InvalidOperationException($"No se encontró manejador para el comando: {commandType.Name}");
        }

        var method = handlerType.GetMethod("HandleAsync");
        if (method == null)
        {
            throw new InvalidOperationException($"Método HandleAsync no encontrado en el manejador para: {commandType.Name}");
        }

        var result = await (Task<TResult>)method.Invoke(handler, new object[] { command })!;
        return result;
    }
}
