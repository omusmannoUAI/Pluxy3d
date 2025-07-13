using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class Usuario
{
    public Guid UsuarioId { get; set; }

    public string? Nombre { get; set; }

    public string? Apellido { get; set; }

    public string? Email { get; set; }

    public string? PasswordHash { get; set; }

    public DateTime? FechaRegistro { get; set; }

    public bool? Activo { get; set; }

    public virtual ICollection<Carrito> Carritos { get; set; } = new List<Carrito>();

    public virtual ICollection<DireccionesUsuario> DireccionesUsuarios { get; set; } = new List<DireccionesUsuario>();

    public virtual ICollection<FavoritosUsuario> FavoritosUsuarios { get; set; } = new List<FavoritosUsuario>();

    public virtual ICollection<HistorialNavegacion> HistorialNavegacions { get; set; } = new List<HistorialNavegacion>();

    public virtual ICollection<ImpresorasPersonalizada> ImpresorasPersonalizada { get; set; } = new List<ImpresorasPersonalizada>();

    public virtual ICollection<LogsIum> LogsIa { get; set; } = new List<LogsIum>();

    public virtual ICollection<MensajesTicket> MensajesTickets { get; set; } = new List<MensajesTicket>();

    public virtual ICollection<ResenasProducto> ResenasProductos { get; set; } = new List<ResenasProducto>();

    public virtual ICollection<TicketsSoporte> TicketsSoportes { get; set; } = new List<TicketsSoporte>();

    public virtual ICollection<Venta> Venta { get; set; } = new List<Venta>();

    public virtual ICollection<Role> Rols { get; set; } = new List<Role>();
}
