namespace Pluxy3dBE.DTOs
{
    public class CartItemDto
    {
        public int Id { get; set; } // Cart item id
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public DiscountDto? Discount { get; set; }
    }

    public class DiscountDto
    {
        public int Percentage { get; set; }
        public decimal OriginalPrice { get; set; }
    }
}
