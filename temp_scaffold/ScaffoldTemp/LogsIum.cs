using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class LogsIum
{
    public int LogId { get; set; }

    public Guid? UsuarioId { get; set; }

    public string? PreguntaUsuario { get; set; }

    public int? RespuestaId { get; set; }

    public DateTime? Fecha { get; set; }

    public virtual RespuestasIum? Respuesta { get; set; }

    public virtual Usuario? Usuario { get; set; }
}
