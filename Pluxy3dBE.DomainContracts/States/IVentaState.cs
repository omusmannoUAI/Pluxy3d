namespace Pluxy3dBE.DomainContracts.States;

/// <summary>
/// Contexto de estado de venta
/// </summary>
public class VentaStateContext
{
    private IVentaState _currentState;
    public int VentaId { get; }
    public Dictionary<string, object> StateData { get; set; } = new();

    public VentaStateContext(int ventaId, IVentaState initialState)
    {
        VentaId = ventaId;
        _currentState = initialState;
    }

    public IVentaState CurrentState => _currentState;
    public string CurrentStateName => _currentState.StateName;

    public async Task<StateTransitionResult> TransitionToAsync(string newStateName)
    {
        return await _currentState.TransitionToAsync(this, newStateName);
    }

    public void SetState(IVentaState newState)
    {
        _currentState = newState;
    }

    public async Task<IEnumerable<string>> GetAvailableTransitionsAsync()
    {
        return await _currentState.GetAvailableTransitionsAsync(this);
    }
}

/// <summary>
/// Resultado de transición de estado
/// </summary>
public class StateTransitionResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? PreviousState { get; set; }
    public string? NewState { get; set; }
    public DateTime TransitionTime { get; set; }
    public Dictionary<string, object> AdditionalData { get; set; } = new();
}

/// <summary>
/// Interfaz base para estados de venta
/// </summary>
public interface IVentaState
{
    string StateName { get; }
    string DisplayName { get; }
    Task<StateTransitionResult> TransitionToAsync(VentaStateContext context, string newStateName);
    Task<IEnumerable<string>> GetAvailableTransitionsAsync(VentaStateContext context);
    Task<bool> CanTransitionToAsync(VentaStateContext context, string newStateName);
    Task OnEnteringAsync(VentaStateContext context, string previousStateName);
    Task OnExitingAsync(VentaStateContext context, string newStateName);
}

/// <summary>
/// Estado base abstracto
/// </summary>
public abstract class BaseVentaState : IVentaState
{
    public abstract string StateName { get; }
    public abstract string DisplayName { get; }

    public virtual async Task<StateTransitionResult> TransitionToAsync(VentaStateContext context, string newStateName)
    {
        if (!await CanTransitionToAsync(context, newStateName))
        {
            return new StateTransitionResult
            {
                Success = false,
                Message = $"No se puede transicionar de {StateName} a {newStateName}",
                PreviousState = StateName,
                TransitionTime = DateTime.UtcNow
            };
        }

        var previousState = StateName;
        var newState = CreateState(newStateName);
        
        // Ejecutar lógica específica antes de la transición
        await OnExitingAsync(context, newStateName);
        
        // Cambiar el estado
        context.SetState(newState);
        
        // Ejecutar lógica específica después de la transición
        await newState.OnEnteringAsync(context, previousState);

        return new StateTransitionResult
        {
            Success = true,
            Message = $"Transición exitosa de {previousState} a {newStateName}",
            PreviousState = previousState,
            NewState = newStateName,
            TransitionTime = DateTime.UtcNow
        };
    }

    public abstract Task<IEnumerable<string>> GetAvailableTransitionsAsync(VentaStateContext context);
    public abstract Task<bool> CanTransitionToAsync(VentaStateContext context, string newStateName);

    protected virtual Task OnExitingAsync(VentaStateContext context, string newStateName)
    {
        return Task.CompletedTask;
    }

    protected virtual Task OnEnteringAsync(VentaStateContext context, string previousStateName)
    {
        return Task.CompletedTask;
    }

    // Implementación explícita de la interfaz
    Task IVentaState.OnExitingAsync(VentaStateContext context, string newStateName)
    {
        return OnExitingAsync(context, newStateName);
    }

    Task IVentaState.OnEnteringAsync(VentaStateContext context, string previousStateName)
    {
        return OnEnteringAsync(context, previousStateName);
    }

    private IVentaState CreateState(string stateName)
    {
        return stateName switch
        {
            "Pendiente" => new PendienteState(),
            "Confirmada" => new ConfirmadaState(),
            "EnProceso" => new EnProcesoState(),
            "Enviada" => new EnviadaState(),
            "Entregada" => new EntregadaState(),
            "Cancelada" => new CanceladaState(),
            "Reembolsada" => new ReembolsadaState(),
            _ => throw new ArgumentException($"Estado no válido: {stateName}")
        };
    }
}

/// <summary>
/// Estado: Pendiente (inicial)
/// </summary>
public class PendienteState : BaseVentaState
{
    public override string StateName => "Pendiente";
    public override string DisplayName => "Pendiente de Confirmación";

    public override Task<IEnumerable<string>> GetAvailableTransitionsAsync(VentaStateContext context)
    {
        var transitions = new[] { "Confirmada", "Cancelada" };
        return Task.FromResult<IEnumerable<string>>(transitions);
    }

    public override Task<bool> CanTransitionToAsync(VentaStateContext context, string newStateName)
    {
        var allowedTransitions = new[] { "Confirmada", "Cancelada" };
        return Task.FromResult(allowedTransitions.Contains(newStateName));
    }
}

/// <summary>
/// Estado: Confirmada
/// </summary>
public class ConfirmadaState : BaseVentaState
{
    public override string StateName => "Confirmada";
    public override string DisplayName => "Confirmada";

    public override Task<IEnumerable<string>> GetAvailableTransitionsAsync(VentaStateContext context)
    {
        var transitions = new[] { "EnProceso", "Cancelada" };
        return Task.FromResult<IEnumerable<string>>(transitions);
    }

    public override Task<bool> CanTransitionToAsync(VentaStateContext context, string newStateName)
    {
        var allowedTransitions = new[] { "EnProceso", "Cancelada" };
        return Task.FromResult(allowedTransitions.Contains(newStateName));
    }

    protected override Task OnEnteringAsync(VentaStateContext context, string previousStateName)
    {
        // Lógica específica cuando se confirma la venta
        context.StateData["FechaConfirmacion"] = DateTime.UtcNow;
        return Task.CompletedTask;
    }
}

/// <summary>
/// Estado: En Proceso
/// </summary>
public class EnProcesoState : BaseVentaState
{
    public override string StateName => "EnProceso";
    public override string DisplayName => "En Proceso";

    public override Task<IEnumerable<string>> GetAvailableTransitionsAsync(VentaStateContext context)
    {
        var transitions = new[] { "Enviada", "Cancelada" };
        return Task.FromResult<IEnumerable<string>>(transitions);
    }

    public override Task<bool> CanTransitionToAsync(VentaStateContext context, string newStateName)
    {
        var allowedTransitions = new[] { "Enviada", "Cancelada" };
        return Task.FromResult(allowedTransitions.Contains(newStateName));
    }

    protected override Task OnEnteringAsync(VentaStateContext context, string previousStateName)
    {
        context.StateData["FechaInicioProceso"] = DateTime.UtcNow;
        return Task.CompletedTask;
    }
}

/// <summary>
/// Estado: Enviada
/// </summary>
public class EnviadaState : BaseVentaState
{
    public override string StateName => "Enviada";
    public override string DisplayName => "Enviada";

    public override Task<IEnumerable<string>> GetAvailableTransitionsAsync(VentaStateContext context)
    {
        var transitions = new[] { "Entregada" };
        return Task.FromResult<IEnumerable<string>>(transitions);
    }

    public override Task<bool> CanTransitionToAsync(VentaStateContext context, string newStateName)
    {
        var allowedTransitions = new[] { "Entregada" };
        return Task.FromResult(allowedTransitions.Contains(newStateName));
    }

    protected override Task OnEnteringAsync(VentaStateContext context, string previousStateName)
    {
        context.StateData["FechaEnvio"] = DateTime.UtcNow;
        context.StateData["NumeroTracking"] = $"TRK{DateTime.UtcNow:yyyyMMdd}{Random.Shared.Next(1000, 9999)}";
        return Task.CompletedTask;
    }
}

/// <summary>
/// Estado: Entregada (final)
/// </summary>
public class EntregadaState : BaseVentaState
{
    public override string StateName => "Entregada";
    public override string DisplayName => "Entregada";

    public override Task<IEnumerable<string>> GetAvailableTransitionsAsync(VentaStateContext context)
    {
        var transitions = new[] { "Reembolsada" }; // Solo se puede reembolsar después de entregada
        return Task.FromResult<IEnumerable<string>>(transitions);
    }

    public override Task<bool> CanTransitionToAsync(VentaStateContext context, string newStateName)
    {
        // Solo se puede reembolsar dentro de un plazo específico
        if (newStateName == "Reembolsada")
        {
            var fechaEntrega = context.StateData.GetValueOrDefault("FechaEntrega") as DateTime?;
            return Task.FromResult(fechaEntrega?.AddDays(30) > DateTime.UtcNow);
        }
        return Task.FromResult(false);
    }

    protected override Task OnEnteringAsync(VentaStateContext context, string previousStateName)
    {
        context.StateData["FechaEntrega"] = DateTime.UtcNow;
        return Task.CompletedTask;
    }
}

/// <summary>
/// Estado: Cancelada (final)
/// </summary>
public class CanceladaState : BaseVentaState
{
    public override string StateName => "Cancelada";
    public override string DisplayName => "Cancelada";

    public override Task<IEnumerable<string>> GetAvailableTransitionsAsync(VentaStateContext context)
    {
        return Task.FromResult<IEnumerable<string>>(Array.Empty<string>());
    }

    public override Task<bool> CanTransitionToAsync(VentaStateContext context, string newStateName)
    {
        return Task.FromResult(false); // Estado final
    }

    protected override Task OnEnteringAsync(VentaStateContext context, string previousStateName)
    {
        context.StateData["FechaCancelacion"] = DateTime.UtcNow;
        context.StateData["MotivosCancelacion"] = "Cancelada por el sistema";
        return Task.CompletedTask;
    }
}

/// <summary>
/// Estado: Reembolsada (final)
/// </summary>
public class ReembolsadaState : BaseVentaState
{
    public override string StateName => "Reembolsada";
    public override string DisplayName => "Reembolsada";

    public override Task<IEnumerable<string>> GetAvailableTransitionsAsync(VentaStateContext context)
    {
        return Task.FromResult<IEnumerable<string>>(Array.Empty<string>());
    }

    public override Task<bool> CanTransitionToAsync(VentaStateContext context, string newStateName)
    {
        return Task.FromResult(false); // Estado final
    }

    protected override Task OnEnteringAsync(VentaStateContext context, string previousStateName)
    {
        context.StateData["FechaReembolso"] = DateTime.UtcNow;
        return Task.CompletedTask;
    }
}

/// <summary>
/// Factory para crear estados
/// </summary>
public interface IVentaStateFactory
{
    IVentaState CreateState(string stateName);
    VentaStateContext CreateContext(int ventaId, string initialStateName);
}

public class VentaStateFactory : IVentaStateFactory
{
    public IVentaState CreateState(string stateName)
    {
        return stateName switch
        {
            "Pendiente" => new PendienteState(),
            "Confirmada" => new ConfirmadaState(),
            "EnProceso" => new EnProcesoState(),
            "Enviada" => new EnviadaState(),
            "Entregada" => new EntregadaState(),
            "Cancelada" => new CanceladaState(),
            "Reembolsada" => new ReembolsadaState(),
            _ => throw new ArgumentException($"Estado no válido: {stateName}")
        };
    }

    public VentaStateContext CreateContext(int ventaId, string initialStateName)
    {
        var initialState = CreateState(initialStateName);
        return new VentaStateContext(ventaId, initialState);
    }
}
