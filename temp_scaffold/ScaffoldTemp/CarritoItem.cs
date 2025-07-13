using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class CarritoItem
{
    public int ItemId { get; set; }

    public int? CarritoId { get; set; }

    public int? ImpresoraId { get; set; }

    public int? Cantidad { get; set; }

    public virtual Carrito? Carrito { get; set; }

    public virtual ImpresorasPersonalizada? Impresora { get; set; }
}
