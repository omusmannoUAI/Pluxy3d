using System;
using System.Collections.Generic;

namespace Pluxy3dBE.Entities;

public partial class Venta
{
    public int VentaId { get; set; }

    public Guid? UsuarioId { get; set; }

    public DateTime? FechaVenta { get; set; }

    public decimal? Total { get; set; }

    public int? EstadoId { get; set; }

    public int? DireccionEnvioId { get; set; }

    public virtual ICollection<DetalleVentum> DetalleVenta { get; set; } = new List<DetalleVentum>();

    public virtual DireccionesUsuario? DireccionEnvio { get; set; }

    public virtual EstadosVentum? Estado { get; set; }

    public virtual ICollection<Pago> Pagos { get; set; } = new List<Pago>();

    public virtual Usuario? Usuario { get; set; }
}
