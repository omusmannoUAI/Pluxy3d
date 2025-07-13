using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class Carrito
{
    public int CarritoId { get; set; }

    public Guid? UsuarioId { get; set; }

    public DateTime? FechaActualizacion { get; set; }

    public virtual ICollection<CarritoItem> CarritoItems { get; set; } = new List<CarritoItem>();

    public virtual Usuario? Usuario { get; set; }
}
