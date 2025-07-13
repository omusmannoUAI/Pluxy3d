using System;
using System.Collections.Generic;

namespace Pluxy3dBE.Entities;

public partial class ImpresorasPersonalizada
{
    public int ImpresoraId { get; set; }

    public Guid? UsuarioId { get; set; }

    public int? ProductoId { get; set; }

    public string? NombrePersonalizado { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public decimal? TotalFinal { get; set; }

    public virtual ICollection<CarritoItem> CarritoItems { get; set; } = new List<CarritoItem>();

    public virtual ICollection<DetalleVentum> DetalleVenta { get; set; } = new List<DetalleVentum>();

    public virtual Producto? Producto { get; set; }

    public virtual Usuario? Usuario { get; set; }
}
