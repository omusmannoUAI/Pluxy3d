namespace Pluxy3dBE.DTOs
{
    public class ProductoDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string Image { get; set; } = string.Empty;
    }
}
