using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class EstadosVentum
{
    public int EstadoId { get; set; }

    public string? Nombre { get; set; }

    public virtual ICollection<Venta> Venta { get; set; } = new List<Venta>();
}
