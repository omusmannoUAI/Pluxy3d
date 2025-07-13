using System;
using System.Collections.Generic;

namespace Pluxy3dBE.Entities;

public partial class ResenasProducto
{
    public int ResenaId { get; set; }

    public Guid? UsuarioId { get; set; }

    public int? ProductoId { get; set; }

    public int? Puntaje { get; set; }

    public string? Comentario { get; set; }

    public DateTime? Fecha { get; set; }

    public virtual Producto? Producto { get; set; }

    public virtual Usuario? Usuario { get; set; }
}
