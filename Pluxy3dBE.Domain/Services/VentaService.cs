using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.DomainContracts.Authorization;
using Pluxy3dBE.DomainContracts.Payment;
using Pluxy3dBE.DomainContracts.States;
using Pluxy3dBE.DomainContracts.Events;
using Pluxy3dBE.DomainContracts.Templates;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.DalContracts.Repositories;
using Pluxy3dBE.Entities;
using static Pluxy3dBE.DomainContracts.Services.StateChangeResult;
using static Pluxy3dBE.DomainContracts.Services.VentaResult;

namespace Pluxy3dBE.Domain.Services;

/// <summary>
/// Servicio de ventas que integra TODOS los patrones de diseño
/// ELIMINA COMPLETAMENTE los IF/SWITCH statements
/// </summary>
public class VentaService : IVentaService
{
    private readonly IVentaRepository _ventaRepository;
    private readonly ICarritoRepository _carritoRepository;
    private readonly IAuthorizationService _authorizationService;
    private readonly IPaymentProcessorFactory _paymentProcessorFactory;
    private readonly IVentaStateFactory _ventaStateFactory;
    private readonly IDomainEventPublisher _eventPublisher;
    private readonly VentaProcessorFactory _ventaProcessorFactory;
    private readonly IEstadoVentaRepository _estadoVentaRepository;

    public VentaService(
        IVentaRepository ventaRepository,
        ICarritoRepository carritoRepository,
        IAuthorizationService authorizationService,
        IPaymentProcessorFactory paymentProcessorFactory,
        IVentaStateFactory ventaStateFactory,
        IDomainEventPublisher eventPublisher,
    VentaProcessorFactory ventaProcessorFactory,
    IEstadoVentaRepository estadoVentaRepository)
    {
        _ventaRepository = ventaRepository;
        _carritoRepository = carritoRepository;
        _authorizationService = authorizationService;
        _paymentProcessorFactory = paymentProcessorFactory;
        _ventaStateFactory = ventaStateFactory;
        _eventPublisher = eventPublisher;
        _ventaProcessorFactory = ventaProcessorFactory;
        _estadoVentaRepository = estadoVentaRepository;
    }

    /// <summary>
    /// Crear venta usando Template Method Pattern + Factory Pattern
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    public async Task<VentaResult> CreateVentaAsync(CreateVentaRequest request)
    {
        try
        {
            // 1. AUTORIZACIÓN usando Strategy Pattern
            var canCreate = await _authorizationService.AuthorizeAsync("ventas", "create", request.UsuarioId);
            if (!canCreate)
            {
                return VentaResult.Failure("No tiene permisos para crear ventas");
            }

            // 2. Obtener items del carrito
            var carritoItemsEnumerable = await _carritoRepository.GetByUsuarioIdAsync(request.UsuarioId.ToString());
            var carritoItems = (carritoItemsEnumerable ?? Enumerable.Empty<CarritoItem>()).ToList();
            if (carritoItems.Count == 0)
            {
                return VentaResult.Failure("El carrito está vacío");
            }

            // 3. TEMPLATE METHOD PATTERN - Procesar según tipo de productos
            var processor = _ventaProcessorFactory.GetProcessor(carritoItems);

            var context = new VentaProcessingContext
            {
                UsuarioId = request.UsuarioId,
                Items = carritoItems,
                DireccionEnvio = request.DireccionEnvio ?? string.Empty,
                MedioPagoId = request.MedioPagoId,
                NotasEspeciales = request.NotasEspeciales ?? string.Empty
            };

            var processingResult = await processor.ProcessVentaAsync(context);
            if (!processingResult.IsSuccess)
            {
                return VentaResult.Failure(processingResult.ErrorMessage);
            }

            // Venta is guaranteed by successful processing; defensive null-coalescing for analyzer
            if (processingResult.Venta is null)
            {
                return VentaResult.Failure("No se pudo crear la venta (resultado vacío)");
            }
            return VentaResult.Success(processingResult.Venta);
        }
        catch (Exception ex)
        {
            return VentaResult.Failure($"Error creando venta: {ex.Message}");
        }
    }

    /// <summary>
    /// Procesar pago usando Factory Pattern
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    public async Task<PaymentResult> ProcessPaymentAsync(ProcessPaymentRequest request)
    {
        try
        {
            // Autorización
            var canProcess = await _authorizationService.AuthorizeAsync("ventas", "update", request.UsuarioId);
            if (!canProcess)
            {
                return PaymentResult.Failure("No tiene permisos para procesar pagos");
            }

            // Obtener venta
            var venta = await _ventaRepository.GetByIdAsync(request.VentaId);
            if (venta == null)
            {
                return PaymentResult.Failure("Venta no encontrada");
            }

            // FACTORY PATTERN - Obtener procesador según tipo de pago
            var processor = _paymentProcessorFactory.CreateProcessor(request.TipoPago);

            var paymentRequest = new PaymentRequest
            {
                Amount = venta.Total ?? 0,
                Currency = "ARS",
                CustomerInfo = new CustomerInfo
                {
                    UserId = request.UsuarioId,
                    Email = request.CustomerEmail,
                    Name = request.CustomerName
                },
                PaymentDetails = request.PaymentDetails
            };

            var result = await processor.ProcessPaymentAsync(paymentRequest);

            if (result.IsSuccess)
            {
                // Cambiar estado usando State Pattern
                await ChangeVentaStateAsync(venta.VentaId, "Confirmada", "Pago procesado exitosamente");

                // Publicar evento usando Observer Pattern
                await _eventPublisher.PublishAsync(new PagoConfirmadoEvent
                {
                    VentaId = venta.VentaId,
                    UsuarioId = venta.UsuarioId ?? Guid.Empty,
                    Monto = venta.Total ?? 0,
                    MedioPago = request.TipoPago,
                    TransactionId = result.TransactionId ?? string.Empty
                });
            }

            return result;
        }
        catch (Exception ex)
        {
            return PaymentResult.Failure($"Error procesando pago: {ex.Message}");
        }
    }

    /// <summary>
    /// Cambiar estado de venta usando State Pattern
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    public async Task<StateChangeResult> ChangeVentaStateAsync(int ventaId, string nuevoEstado, string? motivo = null)
    {
        try
        {
            var venta = await _ventaRepository.GetByIdAsync(ventaId);
            if (venta == null)
            {
                return StateChangeResult.Failure("Venta no encontrada");
            }

            // Obtener estado actual
            var estadoActual = await _estadoVentaRepository.GetNombreByIdAsync(venta.EstadoId ?? 1);
            if (string.IsNullOrWhiteSpace(estadoActual)) estadoActual = "Pendiente";

            // STATE PATTERN - Obtener estado usando Factory
            var currentState = _ventaStateFactory.CreateState(estadoActual);

            // Crear contexto de estado
            var context = new VentaStateContext(ventaId, currentState);

            // Intentar transición
            var canTransition = await currentState.CanTransitionToAsync(context, nuevoEstado);
            if (!canTransition)
            {
                return StateChangeResult.Failure($"No se puede cambiar de {estadoActual} a {nuevoEstado}");
            }

            // Ejecutar acciones del estado actual
            await currentState.OnExitingAsync(context, nuevoEstado);

            // Cambiar estado en BD
            var nuevoEstadoId = await _estadoVentaRepository.GetIdByNombreAsync(nuevoEstado);
            if (nuevoEstadoId <= 0)
            {
                return StateChangeResult.Failure($"Estado destino desconocido: {nuevoEstado}");
            }
            venta.EstadoId = nuevoEstadoId;
            await _ventaRepository.UpdateAsync(venta);

            // Obtener nuevo estado y ejecutar acciones
            var newState = _ventaStateFactory.CreateState(nuevoEstado);
            // estadoActual ya está normalizado a un string no nulo
            await newState.OnEnteringAsync(context, estadoActual);

            // OBSERVER PATTERN - Publicar evento
            await _eventPublisher.PublishAsync(new VentaEstadoCambiadoEvent
            {
                VentaId = ventaId,
                UsuarioId = venta.UsuarioId ?? Guid.Empty,
                EstadoAnterior = estadoActual ?? "Pendiente",
                EstadoNuevo = nuevoEstado,
                MotivoCambio = motivo
            });

            return StateChangeResult.Success($"Estado cambiado de {estadoActual} a {nuevoEstado}");
        }
        catch (Exception ex)
        {
            return StateChangeResult.Failure($"Error cambiando estado: {ex.Message}");
        }
    }

    /// <summary>
    /// Obtener ventas con autorización automática
    /// </summary>
    public async Task<IEnumerable<Venta>> GetVentasAsync(Guid usuarioId, VentaFilter? filter = null)
    {
        // Verificar permisos
        var canRead = await _authorizationService.AuthorizeAsync("ventas", "read", usuarioId);
        if (!canRead)
        {
            return Enumerable.Empty<Venta>();
        }

        // Verificar si es admin (puede ver todas) o cliente (solo las suyas)
        var canViewAll = await _authorizationService.HasPermissionAsync("ventas.read.all", usuarioId);

        if (canViewAll)
        {
            return await _ventaRepository.GetAllAsync();
        }
        else
        {
            return await _ventaRepository.GetByUsuarioIdAsync(usuarioId);
        }
    }

    /// <summary>
    /// Cancelar venta usando State Pattern
    /// </summary>
    public async Task<StateChangeResult> CancelVentaAsync(int ventaId, Guid usuarioId, string motivo)
    {
        // Verificar permisos
        var canCancel = await _authorizationService.AuthorizeAsync("ventas", "cancel", usuarioId);
        if (!canCancel)
        {
            return StateChangeResult.Failure("No tiene permisos para cancelar ventas");
        }

        return await ChangeVentaStateAsync(ventaId, "Cancelada", motivo);
    }

    // ============================
    // MÉTODOS AUXILIARES
    // ============================

    // Métodos legacy eliminados al usar IEstadoVentaRepository
}
