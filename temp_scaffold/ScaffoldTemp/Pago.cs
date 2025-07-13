using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class Pago
{
    public int PagoId { get; set; }

    public int? VentaId { get; set; }

    public int? MedioPagoId { get; set; }

    public DateTime? FechaPago { get; set; }

    public decimal? Monto { get; set; }

    public string? Estado { get; set; }

    public virtual MediosPago? MedioPago { get; set; }

    public virtual Venta? Venta { get; set; }
}
