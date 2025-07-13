using Autofac;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Pluxy3dBE.Composition.Modules;
using Pluxy3dBE.Repository.Data;

namespace Pluxy3dBE.Composition;

/// <summary>
/// Módulo principal de composición que registra todas las dependencias
/// </summary>
public class CompositionModule : Module
{
    private readonly IConfiguration _configuration;

    public CompositionModule(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    protected override void Load(ContainerBuilder builder)
    {
        // Registrar el DbContext
        builder.Register(c =>
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContextFromDb>();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            
            if (string.IsNullOrEmpty(connectionString))
            {
                // Fallback a SQLite si no hay connection string
                optionsBuilder.UseSqlite("Data Source=pluxy3d.db");
            }
            else if (connectionString.Contains("Data Source"))
            {
                optionsBuilder.UseSqlite(connectionString);
            }
            else
            {
                optionsBuilder.UseSqlServer(connectionString);
            }

            return new AppDbContextFromDb(optionsBuilder.Options);
        }).As<AppDbContextFromDb>().InstancePerLifetimeScope();

        // Registrar módulos específicos
        builder.RegisterModule<RepositoryModule>();
        builder.RegisterModule<DomainModule>();
    }
}

/// <summary>
/// Clase estática para facilitar la configuración de Autofac
/// </summary>
public static class CompositionRoot
{
    /// <summary>
    /// Configura el contenedor de Autofac con todos los módulos necesarios
    /// </summary>
    /// <param name="builder">ContainerBuilder de Autofac</param>
    /// <param name="configuration">Configuración de la aplicación</param>
    public static void ConfigureContainer(ContainerBuilder builder, IConfiguration configuration)
    {
        builder.RegisterModule(new CompositionModule(configuration));
    }
}
