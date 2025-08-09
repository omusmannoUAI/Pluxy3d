using System;

namespace Pluxy3dBE.Entities;

public class SimpleCartItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public DateTime CreatedAt { get; set; }
}
