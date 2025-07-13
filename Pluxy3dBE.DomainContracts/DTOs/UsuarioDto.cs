namespace Pluxy3dBE.DomainContracts.DTOs;

/// <summary>
/// DTO para usuario (salida desde repository hacia service/controller)
/// </summary>
public class UsuarioDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Telefono { get; set; }
    public DateTime FechaRegistro { get; set; }
    public bool Activo { get; set; }
    public string? AvatarUrl { get; set; }
    public List<DireccionDto> Direcciones { get; set; } = new();
}

/// <summary>
/// DTO para crear nuevo usuario (entrada desde service hacia repository)
/// </summary>
public class CreateUsuarioDto
{
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Telefono { get; set; }
}

/// <summary>
/// DTO para actualizar usuario
/// </summary>
public class UpdateUsuarioDto
{
    public int Id { get; set; }
    public string? Nombre { get; set; }
    public string? Email { get; set; }
    public string? Telefono { get; set; }
    public bool? Activo { get; set; }
    public string? AvatarUrl { get; set; }
}

/// <summary>
/// DTO para dirección de usuario
/// </summary>
public class DireccionDto
{
    public int Id { get; set; }
    public string Alias { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Ciudad { get; set; } = string.Empty;
    public string CodigoPostal { get; set; } = string.Empty;
    public string Provincia { get; set; } = string.Empty;
    public string Pais { get; set; } = string.Empty;
    public bool EsPrincipal { get; set; }
}

/// <summary>
/// DTO para crear nueva dirección
/// </summary>
public class CreateDireccionDto
{
    public int UsuarioId { get; set; }
    public string Alias { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Ciudad { get; set; } = string.Empty;
    public string CodigoPostal { get; set; } = string.Empty;
    public string Provincia { get; set; } = string.Empty;
    public string Pais { get; set; } = string.Empty;
    public bool EsPrincipal { get; set; }
}
