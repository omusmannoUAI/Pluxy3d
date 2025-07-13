using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class MensajesTicket
{
    public int MensajeId { get; set; }

    public int? TicketId { get; set; }

    public Guid? UsuarioId { get; set; }

    public string? Contenido { get; set; }

    public DateTime? FechaEnvio { get; set; }

    public virtual TicketsSoporte? Ticket { get; set; }

    public virtual Usuario? Usuario { get; set; }
}
