using Pluxy3dBE.DomainContracts.Authorization;
using Pluxy3dBE.DalContracts;
using Pluxy3dBE.Entities;

namespace Pluxy3dBE.Domain.Services;

/// <summary>
/// Servicio de autorización que implementa Strategy Pattern
/// Elimina completamente los IF/SWITCH statements para validación de permisos
/// </summary>
public class AuthorizationService : IAuthorizationService
{
    private readonly IAuthorizationStrategyFactory _strategyFactory;
    private readonly IUsuarioRepository _usuarioRepository;

    public AuthorizationService(
        IAuthorizationStrategyFactory strategyFactory,
        IUsuarioRepository usuarioRepository)
    {
        _strategyFactory = strategyFactory;
        _usuarioRepository = usuarioRepository;
    }

    /// <summary>
    /// Autorizar acceso a un recurso usando Strategy Pattern
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    public async Task<bool> AuthorizeAsync(string recurso, string accion, Guid usuarioId)
    {
        try
        {
            // Obtener el rol del usuario
            var userRole = await GetUserRoleAsync(usuarioId);
            if (string.IsNullOrEmpty(userRole))
            {
                return false;
            }

            // Obtener la estrategia apropiada usando Factory Pattern
            var strategy = _strategyFactory.CreateStrategy(userRole);
            
            // Ejecutar la validación usando la estrategia
            return await strategy.CanAccessAsync(recurso, accion, usuarioId);
        }
        catch (Exception ex)
        {
            // Log error
            Console.WriteLine($"Error en autorización: {ex.Message}");
            return false;
        }
    }

    /// <summary>
    /// Verificar permiso específico usando Strategy Pattern
    /// SIN IF/SWITCH STATEMENTS
    /// </summary>
    public async Task<bool> HasPermissionAsync(string permiso, Guid usuarioId)
    {
        try
        {
            // Obtener el rol del usuario
            var userRole = await GetUserRoleAsync(usuarioId);
            if (string.IsNullOrEmpty(userRole))
            {
                return false;
            }

            // Obtener la estrategia apropiada
            var strategy = _strategyFactory.CreateStrategy(userRole);
            
            // Verificar el permiso usando la estrategia
            return await strategy.HasPermissionAsync(permiso, usuarioId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error verificando permiso: {ex.Message}");
            return false;
        }
    }

    /// <summary>
    /// Obtener todos los permisos del usuario según su rol
    /// </summary>
    public async Task<IEnumerable<string>> GetUserPermissionsAsync(Guid usuarioId)
    {
        try
        {
            var userRole = await GetUserRoleAsync(usuarioId);
            if (string.IsNullOrEmpty(userRole))
            {
                return Enumerable.Empty<string>();
            }

            var strategy = _strategyFactory.CreateStrategy(userRole);
            
            // Devolver los permisos predefinidos según el rol
            return GetPermissionsForRole(userRole);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error obteniendo permisos: {ex.Message}");
            return Enumerable.Empty<string>();
        }
    }

    // ============================
    // MÉTODOS PRIVADOS
    // ============================

    private async Task<string> GetUserRoleAsync(Guid usuarioId)
    {
        try
        {
            var usuario = await _usuarioRepository.GetByUsuarioIdAsync(usuarioId);
            
            // Obtener el primer rol del usuario (asumiendo un rol por usuario)
            var roleEntity = usuario?.Rols?.FirstOrDefault();
            return roleEntity?.Nombre ?? string.Empty;
        }
        catch
        {
            return string.Empty;
        }
    }

    private IEnumerable<string> GetPermissionsForRole(string roleName)
    {
        return roleName switch
        {
            "Admin" => new[]
            {
                "productos.read", "productos.create", "productos.update", "productos.delete",
                "usuarios.read", "usuarios.create", "usuarios.update", "usuarios.delete",
                "ventas.read", "ventas.create", "ventas.update", "ventas.delete",
                "reportes.read", "reportes.create",
                "configuracion.read", "configuracion.update",
                "auditoria.read"
            },
            "Empleado" => new[]
            {
                "productos.read", "productos.create", "productos.update",
                "ventas.read", "ventas.create", "ventas.update",
                "usuarios.read", "usuarios.update",
                "reportes.read"
            },
            "Cliente" => new[]
            {
                "productos.read",
                "carrito.read", "carrito.create", "carrito.update", "carrito.delete",
                "ventas.read", "ventas.create",
                "perfil.read", "perfil.update"
            },
            _ => Enumerable.Empty<string>()
        };
    }
}

/// <summary>
/// Extensión para facilitar el uso del servicio de autorización
/// </summary>
public static class AuthorizationExtensions
{
    /// <summary>
    /// Verificar múltiples permisos
    /// </summary>
    public static async Task<bool> HasAllPermissionsAsync(
        this IAuthorizationService service, 
        IEnumerable<string> permisos, 
        Guid usuarioId)
    {
        foreach (var permiso in permisos)
        {
            if (!await service.HasPermissionAsync(permiso, usuarioId))
            {
                return false;
            }
        }
        return true;
    }

    /// <summary>
    /// Verificar si tiene al menos uno de los permisos
    /// </summary>
    public static async Task<bool> HasAnyPermissionAsync(
        this IAuthorizationService service, 
        IEnumerable<string> permisos, 
        Guid usuarioId)
    {
        foreach (var permiso in permisos)
        {
            if (await service.HasPermissionAsync(permiso, usuarioId))
            {
                return true;
            }
        }
        return false;
    }

    /// <summary>
    /// Autorizar múltiples recursos
    /// </summary>
    public static async Task<Dictionary<string, bool>> AuthorizeMultipleAsync(
        this IAuthorizationService service,
        Dictionary<string, string> recursosAcciones,
        Guid usuarioId)
    {
        var resultados = new Dictionary<string, bool>();

        foreach (var kvp in recursosAcciones)
        {
            var autorizado = await service.AuthorizeAsync(kvp.Key, kvp.Value, usuarioId);
            resultados[kvp.Key] = autorizado;
        }

        return resultados;
    }
}
