using Autofac;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Repository;

namespace Pluxy3dBE.Composition.Modules;

/// <summary>
/// Módulo de Autofac para la configuración de repositorios
/// </summary>
public class RepositoryModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        // TODO: Implementar repositorios después de definir la estructura de datos final
        // Registro del repositorio base genérico
        // builder.RegisterGeneric(typeof(BaseRepository<>))
        //        .As(typeof(IRepository<>))
        //        .InstancePerLifetimeScope();

        // Registro de repositorios específicos
        // builder.RegisterType<ProductoRepository>()
        //        .As<IProductoRepository>()
        //        .InstancePerLifetimeScope();

        // builder.RegisterType<CarritoRepository>()
        //        .As<ICarritoRepository>()
        //        .InstancePerLifetimeScope();

        // Registrar otros repositorios cuando se implementen
        // builder.RegisterType<UsuarioRepository>()
        //        .As<IUsuarioRepository>()
        //        .InstancePerLifetimeScope();

        // builder.RegisterType<VentaRepository>()
        //        .As<IVentaRepository>()
        //        .InstancePerLifetimeScope();
    }
}
