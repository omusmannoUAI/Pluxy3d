using Pluxy3dBE.Entities;
using Pluxy3dBE.DomainContracts.Events;

namespace Pluxy3dBE.DomainContracts.Templates;

/// <summary>
/// Resultado del procesamiento de venta simplificado
/// </summary>
public class VentaProcessingResult
{
    public bool IsSuccess { get; set; }
    public string ErrorMessage { get; set; } = string.Empty;
    public Venta? Venta { get; set; }
}

/// <summary>
/// Contexto para el procesamiento de venta simplificado
/// </summary>
public class VentaProcessingContext
{
    public Guid UsuarioId { get; set; }
    public List<CarritoItem> Items { get; set; } = new();
    public string DireccionEnvio { get; set; } = string.Empty;
    public int MedioPagoId { get; set; }
    public string NotasEspeciales { get; set; } = string.Empty;
}

/// <summary>
/// Template Method simplificado para procesamiento de ventas
/// </summary>
public abstract class VentaProcessingTemplate
{
    private readonly IDomainEventPublisher _eventPublisher;

    protected VentaProcessingTemplate(IDomainEventPublisher eventPublisher)
    {
        _eventPublisher = eventPublisher;
    }

    /// <summary>
    /// Template Method principal
    /// </summary>
    public async Task<VentaProcessingResult> ProcessVentaAsync(VentaProcessingContext context)
    {
        var result = new VentaProcessingResult();

        try
        {
            // 1. Validar request
            if (!await ValidateRequestAsync(context))
            {
                result.ErrorMessage = "Validación fallida";
                return result;
            }

            // 2. Crear venta
            var venta = await CreateVentaAsync(context);

            // 3. Procesar post-venta
            await ProcessPostVentaAsync(venta, context);

            result.IsSuccess = true;
            result.Venta = venta;

            return result;
        }
        catch (Exception ex)
        {
            result.ErrorMessage = $"Error: {ex.Message}";
            return result;
        }
    }

    protected abstract Task<bool> ValidateRequestAsync(VentaProcessingContext context);
    protected abstract Task ProcessPostVentaAsync(Venta venta, VentaProcessingContext context);

    protected virtual Task<Venta> CreateVentaAsync(VentaProcessingContext context)
    {
        // Método sincrónico ya que no requiere operaciones asíncronas
        var venta = new Venta
        {
            UsuarioId = Guid.NewGuid(),
            FechaVenta = DateTime.UtcNow,
            Total = 1000m,
            EstadoId = 1
        };
        return Task.FromResult(venta);
    }
}

/// <summary>
/// Procesador estándar
/// </summary>
public class StandardVentaProcessor : VentaProcessingTemplate
{
    public StandardVentaProcessor(IDomainEventPublisher eventPublisher) : base(eventPublisher)
    {
    }

    protected override Task<bool> ValidateRequestAsync(VentaProcessingContext context)
    {
        return Task.FromResult(context.UsuarioId != Guid.Empty && context.Items.Any());
    }

    protected override Task ProcessPostVentaAsync(Venta venta, VentaProcessingContext context)
    {
        Console.WriteLine($"[STANDARD] Procesando venta {venta.VentaId}");
        return Task.CompletedTask;
    }
}

/// <summary>
/// Procesador personalizado
/// </summary>
public class CustomVentaProcessor : VentaProcessingTemplate
{
    public CustomVentaProcessor(IDomainEventPublisher eventPublisher) : base(eventPublisher)
    {
    }

    protected override Task<bool> ValidateRequestAsync(VentaProcessingContext context)
    {
        return Task.FromResult(context.UsuarioId != Guid.Empty && context.Items.Any());
    }

    protected override Task ProcessPostVentaAsync(Venta venta, VentaProcessingContext context)
    {
        Console.WriteLine($"[CUSTOM] Procesando venta personalizada {venta.VentaId}");
        return Task.CompletedTask;
    }
}

/// <summary>
/// Factory simplificado
/// </summary>
public class VentaProcessorFactory
{
    private readonly IDomainEventPublisher _eventPublisher;

    public VentaProcessorFactory(IDomainEventPublisher eventPublisher)
    {
        _eventPublisher = eventPublisher;
    }

    public VentaProcessingTemplate GetProcessor(List<CarritoItem> items)
    {
        var hasCustomProducts = items.Any(i => i.ImpresoraId > 1000);

        return hasCustomProducts
            ? new CustomVentaProcessor(_eventPublisher)
            : new StandardVentaProcessor(_eventPublisher);
    }
}
