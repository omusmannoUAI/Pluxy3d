using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class ConsultasContacto
{
    public int ConsultaId { get; set; }

    public string? Nombre { get; set; }

    public string? Email { get; set; }

    public string? Mensaje { get; set; }

    public DateTime? Fecha { get; set; }
}
