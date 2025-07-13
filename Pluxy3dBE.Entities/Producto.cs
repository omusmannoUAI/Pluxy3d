using System;
using System.Collections.Generic;

namespace Pluxy3dBE.Entities;

public partial class Producto
{
    public int ProductoId { get; set; }

    public string? Nombre { get; set; }

    public string? Descripcion { get; set; }

    public decimal? PrecioBase { get; set; }

    public int? Stock { get; set; }

    public int? CategoriaId { get; set; }

    public bool? Visible { get; set; }

    public string? Image { get; set; }

    public virtual CategoriasProducto? Categoria { get; set; }

    public virtual ICollection<FavoritosUsuario> FavoritosUsuarios { get; set; } = new List<FavoritosUsuario>();

    public virtual ICollection<ImpresorasPersonalizada> ImpresorasPersonalizada { get; set; } = new List<ImpresorasPersonalizada>();

    public virtual ICollection<ResenasProducto> ResenasProductos { get; set; } = new List<ResenasProducto>();
}
