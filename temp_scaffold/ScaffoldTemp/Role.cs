using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class Role
{
    public int RolId { get; set; }

    public string? Nombre { get; set; }

    public string? Descripcion { get; set; }

    public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}
