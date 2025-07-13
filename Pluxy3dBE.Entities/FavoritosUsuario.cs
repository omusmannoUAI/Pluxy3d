using System;
using System.Collections.Generic;

namespace Pluxy3dBE.Entities;

public partial class FavoritosUsuario
{
    public int FavoritoId { get; set; }

    public Guid? UsuarioId { get; set; }

    public int? ProductoId { get; set; }

    public virtual Producto? Producto { get; set; }

    public virtual Usuario? Usuario { get; set; }
}
