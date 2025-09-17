namespace Pluxy3dBE.DomainContracts.Authorization;

/// <summary>
/// Estrategia para manejar permisos según el rol
/// </summary>
public interface IAuthorizationStrategy
{
    Task<bool> CanAccessAsync(string recurso, string accion, Guid usuarioId);
    Task<bool> HasPermissionAsync(string permiso, Guid usuarioId);
    string RoleName { get; }
}

/// <summary>
/// Estrategia para Administradores - Acceso total
/// </summary>
public class AdminAuthorizationStrategy : IAuthorizationStrategy
{
    public string RoleName => "Admin";

    public Task<bool> CanAccessAsync(string recurso, string accion, Guid usuarioId)
    {
        // Los admins pueden hacer todo
        return Task.FromResult(true);
    }

    public Task<bool> HasPermissionAsync(string permiso, Guid usuarioId)
    {
        // Los admins tienen todos los permisos
        return Task.FromResult(true);
    }
}

/// <summary>
/// Estrategia para Clientes - Acceso limitado
/// </summary>
public class ClienteAuthorizationStrategy : IAuthorizationStrategy
{
    public string RoleName => "Cliente";

    public Task<bool> CanAccessAsync(string recurso, string accion, Guid usuarioId)
    {
        return recurso.ToLower() switch
        {
            "productos" => Task.FromResult(accion.ToLower() is "read" or "list"),
            "carrito" => Task.FromResult(accion.ToLower() is "read" or "create" or "update" or "delete"),
            "ventas" => Task.FromResult(accion.ToLower() is "read" or "create"),
            "perfil" => Task.FromResult(accion.ToLower() is "read" or "update"),
            _ => Task.FromResult(false)
        };
    }

    public Task<bool> HasPermissionAsync(string permiso, Guid usuarioId)
    {
        var clientePermissions = new[]
        {
            "productos.read",
            "carrito.manage",
            "ventas.create",
            "perfil.manage"
        };

        return Task.FromResult(clientePermissions.Contains(permiso));
    }
}

/// <summary>
/// Estrategia para Empleados - Acceso intermedio
/// </summary>
public class EmpleadoAuthorizationStrategy : IAuthorizationStrategy
{
    public string RoleName => "Empleado";

    public Task<bool> CanAccessAsync(string recurso, string accion, Guid usuarioId)
    {
        return recurso.ToLower() switch
        {
            "productos" => Task.FromResult(true), // Empleados pueden gestionar productos
            "ventas" => Task.FromResult(accion.ToLower() is not "delete"), // No pueden eliminar ventas
            "usuarios" => Task.FromResult(accion.ToLower() is "read" or "update"), // Solo lectura/actualización
            "reportes" => Task.FromResult(accion.ToLower() is "read"),
            _ => Task.FromResult(false)
        };
    }

    public Task<bool> HasPermissionAsync(string permiso, Guid usuarioId)
    {
        var empleadoPermissions = new[]
        {
            "productos.manage",
            "ventas.read",
            "ventas.create",
            "ventas.update",
            "usuarios.read",
            "reportes.read"
        };

        return Task.FromResult(empleadoPermissions.Contains(permiso));
    }
}

/// <summary>
/// Factory para crear estrategias de autorización
/// </summary>
public interface IAuthorizationStrategyFactory
{
    IAuthorizationStrategy CreateStrategy(string roleName);
    IEnumerable<IAuthorizationStrategy> GetAllStrategies();
}

public class AuthorizationStrategyFactory : IAuthorizationStrategyFactory
{
    private readonly Dictionary<string, IAuthorizationStrategy> _strategies;

    public AuthorizationStrategyFactory()
    {
        _strategies = new Dictionary<string, IAuthorizationStrategy>
        {
            { "Admin", new AdminAuthorizationStrategy() },
            { "Cliente", new ClienteAuthorizationStrategy() },
            { "Empleado", new EmpleadoAuthorizationStrategy() }
        };
    }

    public IAuthorizationStrategy CreateStrategy(string roleName)
    {
        return _strategies.TryGetValue(roleName, out var strategy)
            ? strategy
            : throw new ArgumentException($"No existe estrategia para el rol: {roleName}");
    }

    public IEnumerable<IAuthorizationStrategy> GetAllStrategies()
    {
        return _strategies.Values;
    }
}

/// <summary>
/// Servicio de autorización que usa Strategy Pattern
/// </summary>
public interface IAuthorizationService
{
    Task<bool> AuthorizeAsync(string recurso, string accion, Guid usuarioId);
    Task<bool> HasPermissionAsync(string permiso, Guid usuarioId);
    Task<IEnumerable<string>> GetUserPermissionsAsync(Guid usuarioId);
}

/// <summary>
/// DTOs para autorización
/// </summary>
public class AuthorizationRequest
{
    public string Recurso { get; set; } = string.Empty;
    public string Accion { get; set; } = string.Empty;
    public Guid usuarioId { get; set; }
}

public class PermissionDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;
}
