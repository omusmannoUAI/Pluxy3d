using Autofac;
using Pluxy3dBE.DomainContracts.Services;
using Pluxy3dBE.Domain.Services;

namespace Pluxy3dBE.Composition.Modules;

/// <summary>
/// Módulo de Autofac para la configuración de servicios de dominio
/// </summary>
public class DomainModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        // Registro de servicios de dominio
        builder.RegisterType<ProductoService>()
               .As<IProductoService>()
               .InstancePerLifetimeScope();

        builder.RegisterType<CarritoService>()
               .As<ICarritoService>()
               .InstancePerLifetimeScope();

        // Registrar otros servicios cuando se implementen
        // builder.RegisterType<UsuarioService>()
        //        .As<IUsuarioService>()
        //        .InstancePerLifetimeScope();

        // builder.RegisterType<OrdenService>()
        //        .As<IOrdenService>()
        //        .InstancePerLifetimeScope();

        // builder.RegisterType<AuthService>()
        //        .As<IAuthService>()
        //        .InstancePerLifetimeScope();
    }
}
