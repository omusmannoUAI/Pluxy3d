using System;
using System.Collections.Generic;

namespace Pluxy3dBE.Entities;

public partial class HistorialNavegacion
{
    public int HistorialId { get; set; }

    public Guid? UsuarioId { get; set; }

    public string? Pagina { get; set; }

    public DateTime? Fecha { get; set; }

    public virtual Usuario? Usuario { get; set; }
}
