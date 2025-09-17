using System.ComponentModel.DataAnnotations;

namespace Pluxy3dBE.DomainContracts.DTOs
{
    public record CreateMensajeDto(
        [property: Required] string Nombre,
        [property: Required, EmailAddress] string Email,
        [property: Required] string Mensaje);

    public record MensajeDto(int Id, string Nombre, string Email, string Mensaje, System.DateTime CreatedAt, bool Read);

    public record PatchReadDto(
        [property: Range(1, int.MaxValue)] int Id,
        bool Read);

    public record DeleteIdDto(
        [property: Range(1, int.MaxValue)] int Id);
}
