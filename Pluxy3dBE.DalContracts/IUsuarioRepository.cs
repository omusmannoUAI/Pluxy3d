using Pluxy3dBE.Entities;

namespace Pluxy3dBE.DalContracts;

/// <summary>
/// Contrato específico para el repositorio de usuarios
/// </summary>
public interface IUsuarioRepository : IRepository<Usuario>
{
    /// <summary>
    /// Obtiene un usuario por email
    /// </summary>
    Task<Usuario?> GetByEmailAsync(string email);

    /// <summary>
    /// Verifica si existe un usuario con el email especificado
    /// </summary>
    Task<bool> ExistsByEmailAsync(string email);

    /// <summary>
    /// Actualiza la fecha de último acceso
    /// </summary>
    Task<bool> UpdateLastAccessAsync(int usuarioId);

    /// <summary>
    /// Actualiza el estado de verificación de email
    /// </summary>
    Task<bool> UpdateEmailVerificationAsync(int usuarioId, bool verified);

    /// <summary>
    /// Obtiene usuarios activos
    /// </summary>
    Task<IEnumerable<Usuario>> GetActiveUsersAsync();

    /// <summary>
    /// Actualiza la contraseña de un usuario
    /// </summary>
    Task<bool> UpdatePasswordAsync(int usuarioId, string passwordHash, string salt);
    
    /// <summary>
    /// Obtiene un usuario por ID usando Guid
    /// </summary>
    Task<Usuario?> GetByUsuarioIdAsync(Guid usuarioId);
    
    /// <summary>
    /// Obtiene usuarios por rol
    /// </summary>
    Task<IEnumerable<Usuario>> GetByRoleAsync(int roleId);
}
