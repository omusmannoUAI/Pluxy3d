using System.ComponentModel.DataAnnotations;

namespace Pluxy3dBE.DomainContracts.DTOs
{
    public record CreateMensajeDto(
        [property: Required] string Nombre,
        [property: Required, EmailAddress] string Email,
        [property: Required] string Mensaje);

    public record MensajeDto(int Id, string Nombre, string Email, string Mensaje, System.DateTime CreatedAt, bool Read);
    public record PatchReadDto(int Id, bool Read);
}
