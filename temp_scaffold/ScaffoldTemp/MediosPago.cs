using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class MediosPago
{
    public int MedioPagoId { get; set; }

    public string? Nombre { get; set; }

    public bool? Activo { get; set; }

    public virtual ICollection<Pago> Pagos { get; set; } = new List<Pago>();
}
