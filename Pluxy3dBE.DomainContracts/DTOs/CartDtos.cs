namespace Pluxy3dBE.DomainContracts.DTOs
{
    public record UpdateCarritoItemDto
    {
        public int ItemId { get; init; }
        public int NuevaCantidad { get; init; }
    }
}
