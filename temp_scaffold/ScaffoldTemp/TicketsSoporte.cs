using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class TicketsSoporte
{
    public int TicketId { get; set; }

    public Guid? UsuarioId { get; set; }

    public string? Asunto { get; set; }

    public string? Estado { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public virtual ICollection<MensajesTicket> MensajesTickets { get; set; } = new List<MensajesTicket>();

    public virtual Usuario? Usuario { get; set; }
}
