namespace Pluxy3dBE.DomainContracts.Events;

/// <summary>
/// Evento base del sistema
/// </summary>
public interface IDomainEvent
{
    Guid EventId { get; }
    DateTime OccurredAt { get; }
    string EventType { get; }
}

/// <summary>
/// Evento base abstracto
/// </summary>
public abstract class BaseDomainEvent : IDomainEvent
{
    public Guid EventId { get; } = Guid.NewGuid();
    public DateTime OccurredAt { get; } = DateTime.UtcNow;
    public abstract string EventType { get; }
}

// ============================
// EVENTOS DE VENTA
// ============================

/// <summary>
/// Evento cuando se crea una nueva venta
/// </summary>
public class VentaCreadaEvent : BaseDomainEvent
{
    public override string EventType => "VentaCreada";
    public int VentaId { get; set; }
    public Guid UsuarioId { get; set; }
    public decimal MontoTotal { get; set; }
    public DateTime FechaVenta { get; set; }
    public List<DetalleVentaInfo> Detalles { get; set; } = new();
}

/// <summary>
/// Evento cuando cambia el estado de una venta
/// </summary>
public class VentaEstadoCambiadoEvent : BaseDomainEvent
{
    public override string EventType => "VentaEstadoCambiado";
    public int VentaId { get; set; }
    public Guid UsuarioId { get; set; }
    public string EstadoAnterior { get; set; } = string.Empty;
    public string EstadoNuevo { get; set; } = string.Empty;
    public string? MotivoCambio { get; set; }
    public Dictionary<string, object> DatosAdicionales { get; set; } = new();
}

/// <summary>
/// Evento cuando se confirma un pago
/// </summary>
public class PagoConfirmadoEvent : BaseDomainEvent
{
    public override string EventType => "PagoConfirmado";
    public int VentaId { get; set; }
    public Guid UsuarioId { get; set; }
    public decimal Monto { get; set; }
    public string MedioPago { get; set; } = string.Empty;
    public string TransactionId { get; set; } = string.Empty;
}

/// <summary>
/// Evento cuando se envía una venta
/// </summary>
public class VentaEnviadaEvent : BaseDomainEvent
{
    public override string EventType => "VentaEnviada";
    public int VentaId { get; set; }
    public Guid UsuarioId { get; set; }
    public string NumeroTracking { get; set; } = string.Empty;
    public string DireccionEnvio { get; set; } = string.Empty;
    public DateTime FechaEnvio { get; set; }
}

/// <summary>
/// Información de detalle de venta para eventos
/// </summary>
public class DetalleVentaInfo
{
    public int ImpresoraId { get; set; }
    public string ProductoNombre { get; set; } = string.Empty;
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal { get; set; }
}

// ============================
// OBSERVADORES/HANDLERS
// ============================

/// <summary>
/// Interfaz para manejadores de eventos
/// </summary>
public interface IDomainEventHandler<TEvent> where TEvent : IDomainEvent
{
    Task HandleAsync(TEvent domainEvent);
    string HandlerName { get; }
    int Priority { get; }
}

/// <summary>
/// Notificador de email para eventos de venta
/// </summary>
public class EmailNotificationHandler : 
    IDomainEventHandler<VentaCreadaEvent>,
    IDomainEventHandler<VentaEstadoCambiadoEvent>,
    IDomainEventHandler<PagoConfirmadoEvent>,
    IDomainEventHandler<VentaEnviadaEvent>
{
    public string HandlerName => "EmailNotification";
    public int Priority => 1;

    public async Task HandleAsync(VentaCreadaEvent domainEvent)
    {
        // Simular envío de email de confirmación de venta
        await Task.Delay(100);
        
        var subject = $"Confirmación de Venta #{domainEvent.VentaId}";
        var body = $"Su venta por ${domainEvent.MontoTotal:C} ha sido creada exitosamente.";
        
        await SendEmailAsync(domainEvent.UsuarioId, subject, body);
        
        Console.WriteLine($"[EMAIL] Venta creada - Usuario: {domainEvent.UsuarioId}, Venta: {domainEvent.VentaId}");
    }

    public async Task HandleAsync(VentaEstadoCambiadoEvent domainEvent)
    {
        await Task.Delay(100);
        
        var subject = $"Actualización de Venta #{domainEvent.VentaId}";
        var body = $"Su venta ha cambiado de estado: {domainEvent.EstadoAnterior} → {domainEvent.EstadoNuevo}";
        
        await SendEmailAsync(domainEvent.UsuarioId, subject, body);
        
        Console.WriteLine($"[EMAIL] Estado cambiado - Venta: {domainEvent.VentaId}, Estado: {domainEvent.EstadoNuevo}");
    }

    public async Task HandleAsync(PagoConfirmadoEvent domainEvent)
    {
        await Task.Delay(100);
        
        var subject = $"Pago Confirmado - Venta #{domainEvent.VentaId}";
        var body = $"Su pago de ${domainEvent.Monto:C} ha sido confirmado. Método: {domainEvent.MedioPago}";
        
        await SendEmailAsync(domainEvent.UsuarioId, subject, body);
        
        Console.WriteLine($"[EMAIL] Pago confirmado - Venta: {domainEvent.VentaId}, Monto: {domainEvent.Monto:C}");
    }

    public async Task HandleAsync(VentaEnviadaEvent domainEvent)
    {
        await Task.Delay(100);
        
        var subject = $"Venta Enviada #{domainEvent.VentaId}";
        var body = $"Su pedido ha sido enviado. Número de seguimiento: {domainEvent.NumeroTracking}";
        
        await SendEmailAsync(domainEvent.UsuarioId, subject, body);
        
        Console.WriteLine($"[EMAIL] Venta enviada - Tracking: {domainEvent.NumeroTracking}");
    }

    private Task SendEmailAsync(Guid usuarioId, string subject, string body)
    {
        // Aquí iría la lógica real de envío de email
        return Task.CompletedTask;
    }
}

/// <summary>
/// Handler para notificaciones push/SMS
/// </summary>
public class PushNotificationHandler : 
    IDomainEventHandler<VentaEstadoCambiadoEvent>,
    IDomainEventHandler<VentaEnviadaEvent>
{
    public string HandlerName => "PushNotification";
    public int Priority => 2;

    public async Task HandleAsync(VentaEstadoCambiadoEvent domainEvent)
    {
        await Task.Delay(50);
        
        var mensaje = GetMensajeParaEstado(domainEvent.EstadoNuevo, domainEvent.VentaId);
        await SendPushNotificationAsync(domainEvent.UsuarioId, mensaje);
        
        Console.WriteLine($"[PUSH] Estado cambiado - Usuario: {domainEvent.UsuarioId}, Mensaje: {mensaje}");
    }

    public async Task HandleAsync(VentaEnviadaEvent domainEvent)
    {
        await Task.Delay(50);
        
        var mensaje = $"📦 Tu pedido #{domainEvent.VentaId} está en camino! Tracking: {domainEvent.NumeroTracking}";
        await SendPushNotificationAsync(domainEvent.UsuarioId, mensaje);
        
        Console.WriteLine($"[PUSH] Venta enviada - Usuario: {domainEvent.UsuarioId}");
    }

    private string GetMensajeParaEstado(string estado, int ventaId)
    {
        return estado switch
        {
            "Confirmada" => $"✅ Tu pedido #{ventaId} ha sido confirmado",
            "EnProceso" => $"🔄 Tu pedido #{ventaId} está siendo preparado",
            "Cancelada" => $"❌ Tu pedido #{ventaId} ha sido cancelado",
            "Entregada" => $"🎉 Tu pedido #{ventaId} ha sido entregado",
            _ => $"📋 Tu pedido #{ventaId} - Estado: {estado}"
        };
    }

    private Task SendPushNotificationAsync(Guid usuarioId, string mensaje)
    {
        // Aquí iría la lógica real de push notifications
        return Task.CompletedTask;
    }
}

/// <summary>
/// Handler para auditoría y logging
/// </summary>
public class AuditLogHandler : 
    IDomainEventHandler<VentaCreadaEvent>,
    IDomainEventHandler<VentaEstadoCambiadoEvent>,
    IDomainEventHandler<PagoConfirmadoEvent>
{
    public string HandlerName => "AuditLog";
    public int Priority => 3;

    public async Task HandleAsync(VentaCreadaEvent domainEvent)
    {
        await Task.Delay(10);
        
        var logEntry = new
        {
            EventType = domainEvent.EventType,
            VentaId = domainEvent.VentaId,
            UsuarioId = domainEvent.UsuarioId,
            MontoTotal = domainEvent.MontoTotal,
            Timestamp = domainEvent.OccurredAt,
            DetallesCount = domainEvent.Detalles.Count
        };
        
        await LogToSystemAsync("VENTA_CREADA", logEntry);
        Console.WriteLine($"[AUDIT] Venta creada - {logEntry}");
    }

    public async Task HandleAsync(VentaEstadoCambiadoEvent domainEvent)
    {
        await Task.Delay(10);
        
        var logEntry = new
        {
            EventType = domainEvent.EventType,
            VentaId = domainEvent.VentaId,
            UsuarioId = domainEvent.UsuarioId,
            EstadoAnterior = domainEvent.EstadoAnterior,
            EstadoNuevo = domainEvent.EstadoNuevo,
            MotivoCambio = domainEvent.MotivoCambio,
            Timestamp = domainEvent.OccurredAt
        };
        
        await LogToSystemAsync("VENTA_ESTADO_CAMBIO", logEntry);
        Console.WriteLine($"[AUDIT] Estado cambiado - {logEntry}");
    }

    public async Task HandleAsync(PagoConfirmadoEvent domainEvent)
    {
        await Task.Delay(10);
        
        var logEntry = new
        {
            EventType = domainEvent.EventType,
            VentaId = domainEvent.VentaId,
            UsuarioId = domainEvent.UsuarioId,
            Monto = domainEvent.Monto,
            MedioPago = domainEvent.MedioPago,
            TransactionId = domainEvent.TransactionId,
            Timestamp = domainEvent.OccurredAt
        };
        
        await LogToSystemAsync("PAGO_CONFIRMADO", logEntry);
        Console.WriteLine($"[AUDIT] Pago confirmado - {logEntry}");
    }

    private Task LogToSystemAsync(string eventType, object logData)
    {
        // Aquí iría la lógica real de logging/auditoría
        return Task.CompletedTask;
    }
}

// ============================
// EVENT PUBLISHER & SUBSCRIPTION
// ============================

/// <summary>
/// Publicador de eventos del dominio
/// </summary>
public interface IDomainEventPublisher
{
    Task PublishAsync<TEvent>(TEvent domainEvent) where TEvent : IDomainEvent;
    void Subscribe<TEvent>(IDomainEventHandler<TEvent> handler) where TEvent : IDomainEvent;
    void Unsubscribe<TEvent>(IDomainEventHandler<TEvent> handler) where TEvent : IDomainEvent;
}

public class DomainEventPublisher : IDomainEventPublisher
{
    private readonly Dictionary<Type, List<object>> _handlers = new();

    public async Task PublishAsync<TEvent>(TEvent domainEvent) where TEvent : IDomainEvent
    {
        var eventType = typeof(TEvent);
        
        if (_handlers.TryGetValue(eventType, out var handlers))
        {
            var typedHandlers = handlers.Cast<IDomainEventHandler<TEvent>>()
                                      .OrderBy(h => h.Priority);

            foreach (var handler in typedHandlers)
            {
                try
                {
                    await handler.HandleAsync(domainEvent);
                }
                catch (Exception ex)
                {
                    // Log error but continue with other handlers
                    Console.WriteLine($"Error en handler {handler.HandlerName}: {ex.Message}");
                }
            }
        }
    }

    public void Subscribe<TEvent>(IDomainEventHandler<TEvent> handler) where TEvent : IDomainEvent
    {
        var eventType = typeof(TEvent);
        
        if (!_handlers.ContainsKey(eventType))
        {
            _handlers[eventType] = new List<object>();
        }
        
        _handlers[eventType].Add(handler);
    }

    public void Unsubscribe<TEvent>(IDomainEventHandler<TEvent> handler) where TEvent : IDomainEvent
    {
        var eventType = typeof(TEvent);
        
        if (_handlers.TryGetValue(eventType, out var handlers))
        {
            handlers.Remove(handler);
        }
    }
}
