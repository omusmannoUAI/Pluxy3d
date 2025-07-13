namespace Pluxy3dBE.DomainContracts.DTOs;

/// <summary>
/// DTO para autenticación - login request
/// </summary>
public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool RememberMe { get; set; } = false;
}

/// <summary>
/// DTO para respuesta de autenticación
/// </summary>
public class AuthResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Token { get; set; }
    public UsuarioDto? Usuario { get; set; }
    public DateTime? TokenExpires { get; set; }
}

/// <summary>
/// DTO para registro de usuario
/// </summary>
public class RegisterDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public bool AceptaTerminos { get; set; }
}

/// <summary>
/// DTO para cambio de contraseña
/// </summary>
public class ChangePasswordDto
{
    public int UsuarioId { get; set; }
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmNewPassword { get; set; } = string.Empty;
}

/// <summary>
/// DTO para recuperación de contraseña
/// </summary>
public class ForgotPasswordDto
{
    public string Email { get; set; } = string.Empty;
}

/// <summary>
/// DTO para resetear contraseña
/// </summary>
public class ResetPasswordDto
{
    public string Email { get; set; } = string.Empty;
    public string Token { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmNewPassword { get; set; } = string.Empty;
}

/// <summary>
/// DTO para refresh token
/// </summary>
public class RefreshTokenDto
{
    public string Token { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
}
