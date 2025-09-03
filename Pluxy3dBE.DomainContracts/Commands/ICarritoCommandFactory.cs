namespace Pluxy3dBE.DomainContracts.Commands;

public interface ICarritoCommandFactory
{
    ICommand<CarritoCommandResult> Create(string action, IDictionary<string, object> args);
}

public class CarritoCommandFactory : ICarritoCommandFactory
{
    public ICommand<CarritoCommandResult> Create(string action, IDictionary<string, object> args)
    {
        return action.ToLowerInvariant() switch
        {
            "add" => new AddItemToCarritoCommand
            {
                ImpresoraId = Get<int>(args, nameof(AddItemToCarritoCommand.ImpresoraId)),
                Cantidad = Get<int>(args, nameof(AddItemToCarritoCommand.Cantidad)),
                UsuarioId = Get<string?>(args, nameof(AddItemToCarritoCommand.UsuarioId)),
                SessionId = Get<string?>(args, nameof(AddItemToCarritoCommand.SessionId)),
                PrecioUnitario = Get<decimal>(args, nameof(AddItemToCarritoCommand.PrecioUnitario))
            },
            "update" => new UpdateCarritoItemCommand
            {
                ItemId = Get<int>(args, nameof(UpdateCarritoItemCommand.ItemId)),
                NuevaCantidad = Get<int>(args, nameof(UpdateCarritoItemCommand.NuevaCantidad)),
                UsuarioId = Get<string?>(args, nameof(UpdateCarritoItemCommand.UsuarioId))
            },
            "remove" => new RemoveItemFromCarritoCommand
            {
                ItemId = Get<int>(args, nameof(RemoveItemFromCarritoCommand.ItemId)),
                UsuarioId = Get<string?>(args, nameof(RemoveItemFromCarritoCommand.UsuarioId))
            },
            "clear" => new ClearCarritoCommand
            {
                UsuarioId = Get<string?>(args, nameof(ClearCarritoCommand.UsuarioId)),
                SessionId = Get<string?>(args, nameof(ClearCarritoCommand.SessionId))
            },
            _ => throw new ArgumentException("Acción no válida", nameof(action))
        };
    }

    private static T Get<T>(IDictionary<string, object> args, string key)
    {
        return args.TryGetValue(key, out var value) && value is not null
            ? (T)Convert.ChangeType(value, typeof(T))
            : default!;
    }
}
