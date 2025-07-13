using System;
using System.Collections.Generic;

namespace ScaffoldTemp;

public partial class NewsletterSuscripcione
{
    public int SuscripcionId { get; set; }

    public string? Email { get; set; }

    public DateTime? FechaAlta { get; set; }

    public bool? Activo { get; set; }
}
