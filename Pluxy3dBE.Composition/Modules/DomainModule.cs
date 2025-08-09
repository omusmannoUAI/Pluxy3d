using Autofac;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.Domain.Services;
using Pluxy3dBE.DomainContracts.Authorization;
using Pluxy3dBE.DomainContracts.Payment;
using Pluxy3dBE.DomainContracts.States;
using Pluxy3dBE.DomainContracts.Commands;
using Pluxy3dBE.DomainContracts.Events;
using Pluxy3dBE.DomainContracts.Templates;

namespace Pluxy3dBE.Composition.Modules;

/// <summary>
/// Módulo de Autofac para la configuración de servicios de dominio y patrones de diseño
/// </summary>
public class DomainModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        // ============================
        // SERVICIOS DE DOMINIO BÁSICOS
        // ============================
        builder.RegisterType<ProductoService>()
               .As<IProductoService>()
               .InstancePerLifetimeScope();

        builder.RegisterType<CarritoService>()
               .As<ICarritoService>()
               .InstancePerLifetimeScope();

        // NUEVOS SERVICIOS CON PATRONES INTEGRADOS
        builder.RegisterType<AuthorizationService>()
               .As<IAuthorizationService>()
               .InstancePerLifetimeScope();

        builder.RegisterType<VentaService>()
               .As<IVentaService>()
               .InstancePerLifetimeScope();

        // ============================
        // PATRÓN STRATEGY - AUTORIZACIÓN
        // ============================
        
        // Registrar las estrategias individuales
        builder.RegisterType<AdminAuthorizationStrategy>()
               .Keyed<IAuthorizationStrategy>("Admin")
               .SingleInstance();

        builder.RegisterType<ClienteAuthorizationStrategy>()
               .Keyed<IAuthorizationStrategy>("Cliente")
               .SingleInstance();

        builder.RegisterType<EmpleadoAuthorizationStrategy>()
               .Keyed<IAuthorizationStrategy>("Empleado")
               .SingleInstance();

        // Registrar el factory
        builder.RegisterType<AuthorizationStrategyFactory>()
               .As<IAuthorizationStrategyFactory>()
               .SingleInstance();

        // ============================
        // PATRÓN FACTORY - PAYMENT PROCESSORS
        // ============================
        
        // Registrar procesadores de pago
        builder.RegisterType<CreditCardProcessor>()
               .Keyed<IPaymentProcessor>("CreditCard")
               .InstancePerLifetimeScope();

        builder.RegisterType<MercadoPagoProcessor>()
               .Keyed<IPaymentProcessor>("MercadoPago")
               .InstancePerLifetimeScope();

        builder.RegisterType<BankTransferProcessor>()
               .Keyed<IPaymentProcessor>("BankTransfer")
               .InstancePerLifetimeScope();

        // Registrar el factory
        builder.RegisterType<PaymentProcessorFactory>()
               .As<IPaymentProcessorFactory>()
               .InstancePerLifetimeScope();

        // ============================
        // PATRÓN STATE - ESTADOS DE VENTA
        // ============================
        
        // Registrar estados
        builder.RegisterType<PendienteState>()
               .Keyed<IVentaState>("Pendiente")
               .InstancePerLifetimeScope();

        builder.RegisterType<ConfirmadaState>()
               .Keyed<IVentaState>("Confirmada")
               .InstancePerLifetimeScope();

        builder.RegisterType<EnProcesoState>()
               .Keyed<IVentaState>("EnProceso")
               .InstancePerLifetimeScope();

        builder.RegisterType<EnviadaState>()
               .Keyed<IVentaState>("Enviada")
               .InstancePerLifetimeScope();

        builder.RegisterType<EntregadaState>()
               .Keyed<IVentaState>("Entregada")
               .InstancePerLifetimeScope();

        builder.RegisterType<CanceladaState>()
               .Keyed<IVentaState>("Cancelada")
               .InstancePerLifetimeScope();

        builder.RegisterType<ReembolsadaState>()
               .Keyed<IVentaState>("Reembolsada")
               .InstancePerLifetimeScope();

        // Registrar el factory
        builder.RegisterType<VentaStateFactory>()
               .As<IVentaStateFactory>()
               .InstancePerLifetimeScope();

        // ============================
        // PATRÓN COMMAND - CARRITO OPERATIONS
        // ============================
        
        // Registrar comandos de carrito
        builder.RegisterType<AddItemToCarritoCommand>()
               .AsSelf()
               .InstancePerLifetimeScope();

        builder.RegisterType<UpdateCarritoItemCommand>()
               .AsSelf()
               .InstancePerLifetimeScope();

        builder.RegisterType<RemoveItemFromCarritoCommand>()
               .AsSelf()
               .InstancePerLifetimeScope();

        builder.RegisterType<ClearCarritoCommand>()
               .AsSelf()
               .InstancePerLifetimeScope();

        builder.RegisterType<TransferCarritoCommand>()
               .AsSelf()
               .InstancePerLifetimeScope();

        // Registrar manejadores de comandos
        builder.RegisterType<AddItemToCarritoHandler>()
               .As<ICommandHandler<AddItemToCarritoCommand, CarritoCommandResult>>()
               .InstancePerLifetimeScope();

        builder.RegisterType<UpdateCarritoItemHandler>()
               .As<ICommandHandler<UpdateCarritoItemCommand, CarritoCommandResult>>()
               .InstancePerLifetimeScope();

        builder.RegisterType<RemoveItemFromCarritoHandler>()
               .As<ICommandHandler<RemoveItemFromCarritoCommand, CarritoCommandResult>>()
               .InstancePerLifetimeScope();

        // Registrar el despachador de comandos
        builder.RegisterType<CommandDispatcher>()
               .As<ICommandDispatcher>()
               .InstancePerLifetimeScope();

        // ============================
        // PATRÓN OBSERVER - EVENTOS
        // ============================
        
        // Registrar el event publisher
        builder.RegisterType<DomainEventPublisher>()
               .As<IDomainEventPublisher>()
               .SingleInstance();

        // Registrar los handlers
        builder.RegisterType<EmailNotificationHandler>()
               .As<IDomainEventHandler<VentaCreadaEvent>>()
               .As<IDomainEventHandler<VentaEstadoCambiadoEvent>>()
               .As<IDomainEventHandler<PagoConfirmadoEvent>>()
               .As<IDomainEventHandler<VentaEnviadaEvent>>()
               .InstancePerLifetimeScope();

        builder.RegisterType<PushNotificationHandler>()
               .As<IDomainEventHandler<VentaEstadoCambiadoEvent>>()
               .As<IDomainEventHandler<VentaEnviadaEvent>>()
               .InstancePerLifetimeScope();

        builder.RegisterType<AuditLogHandler>()
               .As<IDomainEventHandler<VentaCreadaEvent>>()
               .As<IDomainEventHandler<VentaEstadoCambiadoEvent>>()
               .As<IDomainEventHandler<PagoConfirmadoEvent>>()
               .InstancePerLifetimeScope();

        // ============================
        // PATRÓN TEMPLATE METHOD - VENTA PROCESSING
        // ============================
        
        // Registrar el factory para procesadores de venta
        builder.RegisterType<VentaProcessorFactory>()
               .As<VentaProcessorFactory>()
               .InstancePerLifetimeScope();

        // ============================
        // CONFIGURACIÓN DE SUSCRIPCIONES DE EVENTOS
        // ============================
        builder.RegisterBuildCallback(container =>
        {
            var eventPublisher = container.Resolve<IDomainEventPublisher>();
            
            // Suscribir handlers automáticamente
            var emailHandler = container.Resolve<EmailNotificationHandler>();
            var pushHandler = container.Resolve<PushNotificationHandler>();
            var auditHandler = container.Resolve<AuditLogHandler>();

            // Suscribir a eventos específicos
            eventPublisher.Subscribe<VentaCreadaEvent>(emailHandler);
            eventPublisher.Subscribe<VentaEstadoCambiadoEvent>(emailHandler);
            eventPublisher.Subscribe<PagoConfirmadoEvent>(emailHandler);
            eventPublisher.Subscribe<VentaEnviadaEvent>(emailHandler);

            eventPublisher.Subscribe<VentaEstadoCambiadoEvent>(pushHandler);
            eventPublisher.Subscribe<VentaEnviadaEvent>(pushHandler);

            eventPublisher.Subscribe<VentaCreadaEvent>(auditHandler);
            eventPublisher.Subscribe<VentaEstadoCambiadoEvent>(auditHandler);
            eventPublisher.Subscribe<PagoConfirmadoEvent>(auditHandler);
        });
    }
}
