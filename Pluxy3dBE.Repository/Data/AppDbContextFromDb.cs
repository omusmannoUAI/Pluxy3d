using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pluxy3dBE.Entities;

namespace Pluxy3dBE.Repository.Data;

public partial class AppDbContextFromDb : DbContext
{
    public AppDbContextFromDb()
    {
    }

    public AppDbContextFromDb(DbContextOptions<AppDbContextFromDb> options)
        : base(options)
    {
    }

    public virtual DbSet<Carrito> Carritos { get; set; }

    public virtual DbSet<CarritoItem> CarritoItems { get; set; }

    public virtual DbSet<CategoriasProducto> CategoriasProductos { get; set; }

    public virtual DbSet<ComponentesPersonalizable> ComponentesPersonalizables { get; set; }

    public virtual DbSet<ConsultasContacto> ConsultasContactos { get; set; }

    public virtual DbSet<DetalleVentum> DetalleVenta { get; set; }

    public virtual DbSet<DireccionesUsuario> DireccionesUsuarios { get; set; }

    public virtual DbSet<EstadosVentum> EstadosVenta { get; set; }

    public virtual DbSet<FavoritosUsuario> FavoritosUsuarios { get; set; }

    public virtual DbSet<HistorialNavegacion> HistorialNavegacions { get; set; }

    public virtual DbSet<ImpresorasPersonalizada> ImpresorasPersonalizadas { get; set; }

    public virtual DbSet<LogsIum> LogsIa { get; set; }

    public virtual DbSet<MediosPago> MediosPagos { get; set; }

    public virtual DbSet<MensajesTicket> MensajesTickets { get; set; }

    public virtual DbSet<NewsletterSuscripcione> NewsletterSuscripciones { get; set; }

    public virtual DbSet<OpcionesComponente> OpcionesComponentes { get; set; }

    public virtual DbSet<Pago> Pagos { get; set; }

    public virtual DbSet<Producto> Productos { get; set; }

    public virtual DbSet<ResenasProducto> ResenasProductos { get; set; }

    public virtual DbSet<RespuestasIum> RespuestasIa { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<TicketsSoporte> TicketsSoportes { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<Venta> Ventas { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=TUCHOPC\\SQLEXPRESS;Database=Pluxy3dDB;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Carrito>(entity =>
        {
            entity.HasKey(e => e.CarritoId).HasName("PK__carritos__8647FB0916512604");

            entity.ToTable("carritos");

            entity.Property(e => e.CarritoId).HasColumnName("carrito_id");
            entity.Property(e => e.FechaActualizacion)
                .HasColumnType("datetime")
                .HasColumnName("fecha_actualizacion");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.Usuario).WithMany(p => p.Carritos)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__carritos__usuari__5070F446");
        });

        modelBuilder.Entity<CarritoItem>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PK__carrito___52020FDD15942EA5");

            entity.ToTable("carrito_items");

            entity.Property(e => e.ItemId).HasColumnName("item_id");
            entity.Property(e => e.Cantidad).HasColumnName("cantidad");
            entity.Property(e => e.CarritoId).HasColumnName("carrito_id");
            entity.Property(e => e.ImpresoraId).HasColumnName("impresora_id");

            entity.HasOne(d => d.Carrito).WithMany(p => p.CarritoItems)
                .HasForeignKey(d => d.CarritoId)
                .HasConstraintName("FK__carrito_i__carri__534D60F1");

            entity.HasOne(d => d.Impresora).WithMany(p => p.CarritoItems)
                .HasForeignKey(d => d.ImpresoraId)
                .HasConstraintName("FK__carrito_i__impre__5441852A");
        });

        modelBuilder.Entity<CategoriasProducto>(entity =>
        {
            entity.HasKey(e => e.CategoriaId).HasName("PK__categori__DB875A4FF877F55C");

            entity.ToTable("categorias_productos");

            entity.Property(e => e.CategoriaId).HasColumnName("categoria_id");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<ComponentesPersonalizable>(entity =>
        {
            entity.HasKey(e => e.ComponenteId).HasName("PK__componen__7480EE8F96F73AEE");

            entity.ToTable("componentes_personalizables");

            entity.Property(e => e.ComponenteId).HasColumnName("componente_id");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Tipo)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("tipo");
        });

        modelBuilder.Entity<ConsultasContacto>(entity =>
        {
            entity.HasKey(e => e.ConsultaId).HasName("PK__consulta__BBB59BD855340A4D");

            entity.ToTable("consultas_contacto");

            entity.Property(e => e.ConsultaId).HasColumnName("consulta_id");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.Fecha)
                .HasColumnType("datetime")
                .HasColumnName("fecha");
            entity.Property(e => e.Mensaje)
                .HasColumnType("text")
                .HasColumnName("mensaje");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<DetalleVentum>(entity =>
        {
            entity.HasKey(e => e.DetalleId).HasName("PK__detalle___91B12E7087ED20B4");

            entity.ToTable("detalle_venta");

            entity.Property(e => e.DetalleId).HasColumnName("detalle_id");
            entity.Property(e => e.Cantidad).HasColumnName("cantidad");
            entity.Property(e => e.ImpresoraId).HasColumnName("impresora_id");
            entity.Property(e => e.PrecioUnitario)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precio_unitario");
            entity.Property(e => e.VentaId).HasColumnName("venta_id");

            entity.HasOne(d => d.Impresora).WithMany(p => p.DetalleVenta)
                .HasForeignKey(d => d.ImpresoraId)
                .HasConstraintName("FK__detalle_v__impre__6383C8BA");

            entity.HasOne(d => d.Venta).WithMany(p => p.DetalleVenta)
                .HasForeignKey(d => d.VentaId)
                .HasConstraintName("FK__detalle_v__venta__628FA481");
        });

        modelBuilder.Entity<DireccionesUsuario>(entity =>
        {
            entity.HasKey(e => e.DireccionId).HasName("PK__direccio__3CE1758CA4ADA568");

            entity.ToTable("direcciones_usuarios");

            entity.Property(e => e.DireccionId).HasColumnName("direccion_id");
            entity.Property(e => e.Calle)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasColumnName("calle");
            entity.Property(e => e.Ciudad)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("ciudad");
            entity.Property(e => e.CodigoPostal)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("codigo_postal");
            entity.Property(e => e.EsPrincipal).HasColumnName("es_principal");
            entity.Property(e => e.Provincia)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("provincia");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.Usuario).WithMany(p => p.DireccionesUsuarios)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__direccion__usuar__403A8C7D");
        });

        modelBuilder.Entity<EstadosVentum>(entity =>
        {
            entity.HasKey(e => e.EstadoId).HasName("PK__estados___053774EF0D8DF71A");

            entity.ToTable("estados_venta");

            entity.Property(e => e.EstadoId).HasColumnName("estado_id");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<FavoritosUsuario>(entity =>
        {
            entity.HasKey(e => e.FavoritoId).HasName("PK__favorito__B8BA20CA91C0EAE8");

            entity.ToTable("favoritos_usuarios");

            entity.Property(e => e.FavoritoId).HasColumnName("favorito_id");
            entity.Property(e => e.ProductoId).HasColumnName("producto_id");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.Producto).WithMany(p => p.FavoritosUsuarios)
                .HasForeignKey(d => d.ProductoId)
                .HasConstraintName("FK__favoritos__produ__02084FDA");

            entity.HasOne(d => d.Usuario).WithMany(p => p.FavoritosUsuarios)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__favoritos__usuar__01142BA1");
        });

        modelBuilder.Entity<HistorialNavegacion>(entity =>
        {
            entity.HasKey(e => e.HistorialId).HasName("PK__historia__68FE18EE9C5C8CFA");

            entity.ToTable("historial_navegacion");

            entity.Property(e => e.HistorialId).HasColumnName("historial_id");
            entity.Property(e => e.Fecha)
                .HasColumnType("datetime")
                .HasColumnName("fecha");
            entity.Property(e => e.Pagina)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("pagina");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.Usuario).WithMany(p => p.HistorialNavegacions)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__historial__usuar__7E37BEF6");
        });

        modelBuilder.Entity<ImpresorasPersonalizada>(entity =>
        {
            entity.HasKey(e => e.ImpresoraId).HasName("PK__impresor__2BDA8F2755B6A4E9");

            entity.ToTable("impresoras_personalizadas");

            entity.Property(e => e.ImpresoraId).HasColumnName("impresora_id");
            entity.Property(e => e.FechaCreacion)
                .HasColumnType("datetime")
                .HasColumnName("fecha_creacion");
            entity.Property(e => e.NombrePersonalizado)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre_personalizado");
            entity.Property(e => e.ProductoId).HasColumnName("producto_id");
            entity.Property(e => e.TotalFinal)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("total_final");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.Producto).WithMany(p => p.ImpresorasPersonalizada)
                .HasForeignKey(d => d.ProductoId)
                .HasConstraintName("FK__impresora__produ__4D94879B");

            entity.HasOne(d => d.Usuario).WithMany(p => p.ImpresorasPersonalizada)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__impresora__usuar__4CA06362");
        });

        modelBuilder.Entity<LogsIum>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__logs_ia__9E2397E08801C21A");

            entity.ToTable("logs_ia");

            entity.Property(e => e.LogId).HasColumnName("log_id");
            entity.Property(e => e.Fecha)
                .HasColumnType("datetime")
                .HasColumnName("fecha");
            entity.Property(e => e.PreguntaUsuario)
                .HasColumnType("text")
                .HasColumnName("pregunta_usuario");
            entity.Property(e => e.RespuestaId).HasColumnName("respuesta_id");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.Respuesta).WithMany(p => p.LogsIa)
                .HasForeignKey(d => d.RespuestaId)
                .HasConstraintName("FK__logs_ia__respues__75A278F5");

            entity.HasOne(d => d.Usuario).WithMany(p => p.LogsIa)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__logs_ia__usuario__74AE54BC");
        });

        modelBuilder.Entity<MediosPago>(entity =>
        {
            entity.HasKey(e => e.MedioPagoId).HasName("PK__medios_p__56065D0527EE448D");

            entity.ToTable("medios_pago");

            entity.Property(e => e.MedioPagoId).HasColumnName("medio_pago_id");
            entity.Property(e => e.Activo).HasColumnName("activo");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<MensajesTicket>(entity =>
        {
            entity.HasKey(e => e.MensajeId).HasName("PK__mensajes__6B304DCDEFFC63D8");

            entity.ToTable("mensajes_ticket");

            entity.Property(e => e.MensajeId).HasColumnName("mensaje_id");
            entity.Property(e => e.Contenido)
                .HasColumnType("text")
                .HasColumnName("contenido");
            entity.Property(e => e.FechaEnvio)
                .HasColumnType("datetime")
                .HasColumnName("fecha_envio");
            entity.Property(e => e.TicketId).HasColumnName("ticket_id");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.Ticket).WithMany(p => p.MensajesTickets)
                .HasForeignKey(d => d.TicketId)
                .HasConstraintName("FK__mensajes___ticke__6EF57B66");

            entity.HasOne(d => d.Usuario).WithMany(p => p.MensajesTickets)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__mensajes___usuar__6FE99F9F");
        });

        modelBuilder.Entity<NewsletterSuscripcione>(entity =>
        {
            entity.HasKey(e => e.SuscripcionId).HasName("PK__newslett__855431D0987B0979");

            entity.ToTable("newsletter_suscripciones");

            entity.Property(e => e.SuscripcionId).HasColumnName("suscripcion_id");
            entity.Property(e => e.Activo).HasColumnName("activo");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FechaAlta)
                .HasColumnType("datetime")
                .HasColumnName("fecha_alta");
        });

        modelBuilder.Entity<OpcionesComponente>(entity =>
        {
            entity.HasKey(e => e.OpcionId).HasName("PK__opciones__FFA6A8F8F0655382");

            entity.ToTable("opciones_componentes");

            entity.Property(e => e.OpcionId).HasColumnName("opcion_id");
            entity.Property(e => e.ComponenteId).HasColumnName("componente_id");
            entity.Property(e => e.ImagenUrl)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("imagen_url");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.PrecioAdicional)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precio_adicional");

            entity.HasOne(d => d.Componente).WithMany(p => p.OpcionesComponentes)
                .HasForeignKey(d => d.ComponenteId)
                .HasConstraintName("FK__opciones___compo__49C3F6B7");
        });

        modelBuilder.Entity<Pago>(entity =>
        {
            entity.HasKey(e => e.PagoId).HasName("PK__pagos__FFF0A58E3A93F693");

            entity.ToTable("pagos");

            entity.Property(e => e.PagoId).HasColumnName("pago_id");
            entity.Property(e => e.Estado)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("estado");
            entity.Property(e => e.FechaPago)
                .HasColumnType("datetime")
                .HasColumnName("fecha_pago");
            entity.Property(e => e.MedioPagoId).HasColumnName("medio_pago_id");
            entity.Property(e => e.Monto)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("monto");
            entity.Property(e => e.VentaId).HasColumnName("venta_id");

            entity.HasOne(d => d.MedioPago).WithMany(p => p.Pagos)
                .HasForeignKey(d => d.MedioPagoId)
                .HasConstraintName("FK__pagos__medio_pag__693CA210");

            entity.HasOne(d => d.Venta).WithMany(p => p.Pagos)
                .HasForeignKey(d => d.VentaId)
                .HasConstraintName("FK__pagos__venta_id__68487DD7");
        });

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.HasKey(e => e.ProductoId).HasName("PK__producto__FB5CEEECEE4023FE");

            entity.ToTable("productos");

            entity.Property(e => e.ProductoId).HasColumnName("producto_id");
            entity.Property(e => e.CategoriaId).HasColumnName("categoria_id");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.Image).HasColumnName("image");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.PrecioBase)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("precio_base");
            entity.Property(e => e.Stock).HasColumnName("stock");
            entity.Property(e => e.Visible).HasColumnName("visible");

            entity.HasOne(d => d.Categoria).WithMany(p => p.Productos)
                .HasForeignKey(d => d.CategoriaId)
                .HasConstraintName("FK__productos__categ__44FF419A");
        });

        modelBuilder.Entity<ResenasProducto>(entity =>
        {
            entity.HasKey(e => e.ResenaId).HasName("PK__resenas___642724501C1F752B");

            entity.ToTable("resenas_productos");

            entity.Property(e => e.ResenaId).HasColumnName("resena_id");
            entity.Property(e => e.Comentario)
                .HasColumnType("text")
                .HasColumnName("comentario");
            entity.Property(e => e.Fecha)
                .HasColumnType("datetime")
                .HasColumnName("fecha");
            entity.Property(e => e.ProductoId).HasColumnName("producto_id");
            entity.Property(e => e.Puntaje).HasColumnName("puntaje");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.Producto).WithMany(p => p.ResenasProductos)
                .HasForeignKey(d => d.ProductoId)
                .HasConstraintName("FK__resenas_p__produ__797309D9");

            entity.HasOne(d => d.Usuario).WithMany(p => p.ResenasProductos)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__resenas_p__usuar__787EE5A0");
        });

        modelBuilder.Entity<RespuestasIum>(entity =>
        {
            entity.HasKey(e => e.RespuestaId).HasName("PK__respuest__5D54E93D4E4C9077");

            entity.ToTable("respuestas_ia");

            entity.Property(e => e.RespuestaId).HasColumnName("respuesta_id");
            entity.Property(e => e.PreguntaClave)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("pregunta_clave");
            entity.Property(e => e.RespuestaTexto)
                .HasColumnType("text")
                .HasColumnName("respuesta_texto");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RolId).HasName("PK__roles__CF32E443E00AD312");

            entity.ToTable("roles");

            entity.Property(e => e.RolId).HasColumnName("rol_id");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("nombre");
        });

        modelBuilder.Entity<TicketsSoporte>(entity =>
        {
            entity.HasKey(e => e.TicketId).HasName("PK__tickets___D596F96BFDB74479");

            entity.ToTable("tickets_soporte");

            entity.Property(e => e.TicketId).HasColumnName("ticket_id");
            entity.Property(e => e.Asunto)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("asunto");
            entity.Property(e => e.Estado)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("estado");
            entity.Property(e => e.FechaCreacion)
                .HasColumnType("datetime")
                .HasColumnName("fecha_creacion");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.Usuario).WithMany(p => p.TicketsSoportes)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__tickets_s__usuar__6C190EBB");
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.UsuarioId).HasName("PK__usuarios__2ED7D2AFB0688E30");

            entity.ToTable("usuarios");

            entity.HasIndex(e => e.Email, "UQ__usuarios__AB6E6164050A4AD0").IsUnique();

            entity.Property(e => e.UsuarioId)
                .ValueGeneratedNever()
                .HasColumnName("usuario_id");
            entity.Property(e => e.Activo).HasColumnName("activo");
            entity.Property(e => e.Apellido)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("apellido");
            entity.Property(e => e.Email)
                .HasMaxLength(150)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FechaRegistro)
                .HasColumnType("datetime")
                .HasColumnName("fecha_registro");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("password_hash");

            entity.HasMany(d => d.Rols).WithMany(p => p.Usuarios)
                .UsingEntity<Dictionary<string, object>>(
                    "UsuarioRole",
                    r => r.HasOne<Role>().WithMany()
                        .HasForeignKey("RolId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__usuario_r__rol_i__3D5E1FD2"),
                    l => l.HasOne<Usuario>().WithMany()
                        .HasForeignKey("UsuarioId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__usuario_r__usuar__3C69FB99"),
                    j =>
                    {
                        j.HasKey("UsuarioId", "RolId").HasName("PK__usuario___0224FCEB9141F2BA");
                        j.ToTable("usuario_roles");
                        j.IndexerProperty<Guid>("UsuarioId").HasColumnName("usuario_id");
                        j.IndexerProperty<int>("RolId").HasColumnName("rol_id");
                    });
        });

        modelBuilder.Entity<Venta>(entity =>
        {
            entity.HasKey(e => e.VentaId).HasName("PK__ventas__B135080906DF1020");

            entity.ToTable("ventas");

            entity.Property(e => e.VentaId).HasColumnName("venta_id");
            entity.Property(e => e.DireccionEnvioId).HasColumnName("direccion_envio_id");
            entity.Property(e => e.EstadoId).HasColumnName("estado_id");
            entity.Property(e => e.FechaVenta)
                .HasColumnType("datetime")
                .HasColumnName("fecha_venta");
            entity.Property(e => e.Total)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("total");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

            entity.HasOne(d => d.DireccionEnvio).WithMany(p => p.Venta)
                .HasForeignKey(d => d.DireccionEnvioId)
                .HasConstraintName("FK__ventas__direccio__5FB337D6");

            entity.HasOne(d => d.Estado).WithMany(p => p.Venta)
                .HasForeignKey(d => d.EstadoId)
                .HasConstraintName("FK__ventas__estado_i__5EBF139D");

            entity.HasOne(d => d.Usuario).WithMany(p => p.Venta)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__ventas__usuario___5DCAEF64");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
