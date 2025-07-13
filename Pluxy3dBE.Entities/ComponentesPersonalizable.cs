using System;
using System.Collections.Generic;

namespace Pluxy3dBE.Entities;

public partial class ComponentesPersonalizable
{
    public int ComponenteId { get; set; }

    public string? Nombre { get; set; }

    public string? Descripcion { get; set; }

    public string? Tipo { get; set; }

    public virtual ICollection<OpcionesComponente> OpcionesComponentes { get; set; } = new List<OpcionesComponente>();
}
