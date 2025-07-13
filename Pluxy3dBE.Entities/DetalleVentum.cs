using System;
using System.Collections.Generic;

namespace Pluxy3dBE.Entities;

public partial class DetalleVentum
{
    public int DetalleId { get; set; }

    public int? VentaId { get; set; }

    public int? ImpresoraId { get; set; }

    public int? Cantidad { get; set; }

    public decimal? PrecioUnitario { get; set; }

    public virtual ImpresorasPersonalizada? Impresora { get; set; }

    public virtual Venta? Venta { get; set; }
}
