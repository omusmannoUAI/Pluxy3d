using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class RespuestasIum
{
    public int RespuestaId { get; set; }

    public string? PreguntaClave { get; set; }

    public string? RespuestaTexto { get; set; }

    public virtual ICollection<LogsIum> LogsIa { get; set; } = new List<LogsIum>();
}
