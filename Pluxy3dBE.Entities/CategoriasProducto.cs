using System;
using System.Collections.Generic;

namespace Pluxy3dBE.Entities;

public partial class CategoriasProducto
{
    public int CategoriaId { get; set; }

    public string? Nombre { get; set; }

    public string? Descripcion { get; set; }

    public virtual ICollection<Producto> Productos { get; set; } = new List<Producto>();
}
