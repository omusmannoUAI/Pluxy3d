using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class OpcionesComponente
{
    public int OpcionId { get; set; }

    public int? ComponenteId { get; set; }

    public string? Nombre { get; set; }

    public decimal? PrecioAdicional { get; set; }

    public string? ImagenUrl { get; set; }

    public virtual ComponentesPersonalizable? Componente { get; set; }
}
