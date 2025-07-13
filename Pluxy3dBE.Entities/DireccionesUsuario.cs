using System;
using System.Collections.Generic;

namespace Pluxy3dBE.Entities;

public partial class DireccionesUsuario
{
    public int DireccionId { get; set; }

    public Guid? UsuarioId { get; set; }

    public string? Provincia { get; set; }

    public string? Ciudad { get; set; }

    public string? Calle { get; set; }

    public string? CodigoPostal { get; set; }

    public bool? EsPrincipal { get; set; }

    public virtual Usuario? Usuario { get; set; }

    public virtual ICollection<Venta> Venta { get; set; } = new List<Venta>();
}
