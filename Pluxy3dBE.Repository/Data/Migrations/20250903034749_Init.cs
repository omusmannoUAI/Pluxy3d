using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Pluxy3dBE.Repository.Data.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "categorias_productos",
                columns: table => new
                {
                    categoria_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    nombre = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: true),
                    descripcion = table.Column<string>(type: "TEXT", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__categori__DB875A4FF877F55C", x => x.categoria_id);
                });

            migrationBuilder.CreateTable(
                name: "componentes_personalizables",
                columns: table => new
                {
                    componente_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    nombre = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: true),
                    descripcion = table.Column<string>(type: "TEXT", unicode: false, maxLength: 255, nullable: true),
                    tipo = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__componen__7480EE8F96F73AEE", x => x.componente_id);
                });

            migrationBuilder.CreateTable(
                name: "consultas_contacto",
                columns: table => new
                {
                    consulta_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    nombre = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: true),
                    email = table.Column<string>(type: "TEXT", unicode: false, maxLength: 150, nullable: true),
                    mensaje = table.Column<string>(type: "text", nullable: true),
                    fecha = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__consulta__BBB59BD855340A4D", x => x.consulta_id);
                });

            migrationBuilder.CreateTable(
                name: "estados_venta",
                columns: table => new
                {
                    estado_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    nombre = table.Column<string>(type: "TEXT", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__estados___053774EF0D8DF71A", x => x.estado_id);
                });

            migrationBuilder.CreateTable(
                name: "medios_pago",
                columns: table => new
                {
                    medio_pago_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    nombre = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: true),
                    activo = table.Column<bool>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__medios_p__56065D0527EE448D", x => x.medio_pago_id);
                });

            migrationBuilder.CreateTable(
                name: "newsletter_suscripciones",
                columns: table => new
                {
                    suscripcion_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    email = table.Column<string>(type: "TEXT", unicode: false, maxLength: 150, nullable: true),
                    fecha_alta = table.Column<DateTime>(type: "datetime", nullable: true),
                    activo = table.Column<bool>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__newslett__855431D0987B0979", x => x.suscripcion_id);
                });

            migrationBuilder.CreateTable(
                name: "respuestas_ia",
                columns: table => new
                {
                    respuesta_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    pregunta_clave = table.Column<string>(type: "TEXT", unicode: false, maxLength: 255, nullable: true),
                    respuesta_texto = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__respuest__5D54E93D4E4C9077", x => x.respuesta_id);
                });

            migrationBuilder.CreateTable(
                name: "roles",
                columns: table => new
                {
                    rol_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    nombre = table.Column<string>(type: "TEXT", unicode: false, maxLength: 50, nullable: true),
                    descripcion = table.Column<string>(type: "TEXT", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__roles__CF32E443E00AD312", x => x.rol_id);
                });

            migrationBuilder.CreateTable(
                name: "simple_cart_items",
                columns: table => new
                {
                    id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    producto_id = table.Column<int>(type: "INTEGER", nullable: false),
                    cantidad = table.Column<int>(type: "INTEGER", nullable: false),
                    created_at = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_simple_cart_items", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    usuario_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    nombre = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: true),
                    apellido = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: true),
                    email = table.Column<string>(type: "TEXT", unicode: false, maxLength: 150, nullable: true),
                    password_hash = table.Column<string>(type: "TEXT", unicode: false, maxLength: 255, nullable: true),
                    fecha_registro = table.Column<DateTime>(type: "datetime", nullable: true),
                    activo = table.Column<bool>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__usuarios__2ED7D2AFB0688E30", x => x.usuario_id);
                });

            migrationBuilder.CreateTable(
                name: "productos",
                columns: table => new
                {
                    producto_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    nombre = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: true),
                    descripcion = table.Column<string>(type: "TEXT", unicode: false, maxLength: 500, nullable: true),
                    precio_base = table.Column<decimal>(type: "decimal(10, 2)", nullable: true),
                    stock = table.Column<int>(type: "INTEGER", nullable: true),
                    categoria_id = table.Column<int>(type: "INTEGER", nullable: true),
                    visible = table.Column<bool>(type: "INTEGER", nullable: true),
                    image = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__producto__FB5CEEECEE4023FE", x => x.producto_id);
                    table.ForeignKey(
                        name: "FK__productos__categ__44FF419A",
                        column: x => x.categoria_id,
                        principalTable: "categorias_productos",
                        principalColumn: "categoria_id");
                });

            migrationBuilder.CreateTable(
                name: "opciones_componentes",
                columns: table => new
                {
                    opcion_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    componente_id = table.Column<int>(type: "INTEGER", nullable: true),
                    nombre = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: true),
                    precio_adicional = table.Column<decimal>(type: "decimal(10, 2)", nullable: true),
                    imagen_url = table.Column<string>(type: "TEXT", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__opciones__FFA6A8F8F0655382", x => x.opcion_id);
                    table.ForeignKey(
                        name: "FK__opciones___compo__49C3F6B7",
                        column: x => x.componente_id,
                        principalTable: "componentes_personalizables",
                        principalColumn: "componente_id");
                });

            migrationBuilder.CreateTable(
                name: "carritos",
                columns: table => new
                {
                    carrito_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    usuario_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    fecha_actualizacion = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__carritos__8647FB0916512604", x => x.carrito_id);
                    table.ForeignKey(
                        name: "FK__carritos__usuari__5070F446",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id");
                });

            migrationBuilder.CreateTable(
                name: "direcciones_usuarios",
                columns: table => new
                {
                    direccion_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    usuario_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    provincia = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: true),
                    ciudad = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: true),
                    calle = table.Column<string>(type: "TEXT", unicode: false, maxLength: 200, nullable: true),
                    codigo_postal = table.Column<string>(type: "TEXT", unicode: false, maxLength: 20, nullable: true),
                    es_principal = table.Column<bool>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__direccio__3CE1758CA4ADA568", x => x.direccion_id);
                    table.ForeignKey(
                        name: "FK__direccion__usuar__403A8C7D",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id");
                });

            migrationBuilder.CreateTable(
                name: "historial_navegacion",
                columns: table => new
                {
                    historial_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    usuario_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    pagina = table.Column<string>(type: "TEXT", unicode: false, maxLength: 255, nullable: true),
                    fecha = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__historia__68FE18EE9C5C8CFA", x => x.historial_id);
                    table.ForeignKey(
                        name: "FK__historial__usuar__7E37BEF6",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id");
                });

            migrationBuilder.CreateTable(
                name: "logs_ia",
                columns: table => new
                {
                    log_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    usuario_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    pregunta_usuario = table.Column<string>(type: "text", nullable: true),
                    respuesta_id = table.Column<int>(type: "INTEGER", nullable: true),
                    fecha = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__logs_ia__9E2397E08801C21A", x => x.log_id);
                    table.ForeignKey(
                        name: "FK__logs_ia__respues__75A278F5",
                        column: x => x.respuesta_id,
                        principalTable: "respuestas_ia",
                        principalColumn: "respuesta_id");
                    table.ForeignKey(
                        name: "FK__logs_ia__usuario__74AE54BC",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id");
                });

            migrationBuilder.CreateTable(
                name: "tickets_soporte",
                columns: table => new
                {
                    ticket_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    usuario_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    asunto = table.Column<string>(type: "TEXT", unicode: false, maxLength: 255, nullable: true),
                    estado = table.Column<string>(type: "TEXT", unicode: false, maxLength: 50, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__tickets___D596F96BFDB74479", x => x.ticket_id);
                    table.ForeignKey(
                        name: "FK__tickets_s__usuar__6C190EBB",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id");
                });

            migrationBuilder.CreateTable(
                name: "usuario_roles",
                columns: table => new
                {
                    usuario_id = table.Column<Guid>(type: "TEXT", nullable: false),
                    rol_id = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__usuario___0224FCEB9141F2BA", x => new { x.usuario_id, x.rol_id });
                    table.ForeignKey(
                        name: "FK__usuario_r__rol_i__3D5E1FD2",
                        column: x => x.rol_id,
                        principalTable: "roles",
                        principalColumn: "rol_id");
                    table.ForeignKey(
                        name: "FK__usuario_r__usuar__3C69FB99",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id");
                });

            migrationBuilder.CreateTable(
                name: "favoritos_usuarios",
                columns: table => new
                {
                    favorito_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    usuario_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    producto_id = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__favorito__B8BA20CA91C0EAE8", x => x.favorito_id);
                    table.ForeignKey(
                        name: "FK__favoritos__produ__02084FDA",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "producto_id");
                    table.ForeignKey(
                        name: "FK__favoritos__usuar__01142BA1",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id");
                });

            migrationBuilder.CreateTable(
                name: "impresoras_personalizadas",
                columns: table => new
                {
                    impresora_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    usuario_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    producto_id = table.Column<int>(type: "INTEGER", nullable: true),
                    nombre_personalizado = table.Column<string>(type: "TEXT", unicode: false, maxLength: 100, nullable: true),
                    fecha_creacion = table.Column<DateTime>(type: "datetime", nullable: true),
                    total_final = table.Column<decimal>(type: "decimal(10, 2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__impresor__2BDA8F2755B6A4E9", x => x.impresora_id);
                    table.ForeignKey(
                        name: "FK__impresora__produ__4D94879B",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "producto_id");
                    table.ForeignKey(
                        name: "FK__impresora__usuar__4CA06362",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id");
                });

            migrationBuilder.CreateTable(
                name: "resenas_productos",
                columns: table => new
                {
                    resena_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    usuario_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    producto_id = table.Column<int>(type: "INTEGER", nullable: true),
                    puntaje = table.Column<int>(type: "INTEGER", nullable: true),
                    comentario = table.Column<string>(type: "text", nullable: true),
                    fecha = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__resenas___642724501C1F752B", x => x.resena_id);
                    table.ForeignKey(
                        name: "FK__resenas_p__produ__797309D9",
                        column: x => x.producto_id,
                        principalTable: "productos",
                        principalColumn: "producto_id");
                    table.ForeignKey(
                        name: "FK__resenas_p__usuar__787EE5A0",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id");
                });

            migrationBuilder.CreateTable(
                name: "ventas",
                columns: table => new
                {
                    venta_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    usuario_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    fecha_venta = table.Column<DateTime>(type: "datetime", nullable: true),
                    total = table.Column<decimal>(type: "decimal(10, 2)", nullable: true),
                    estado_id = table.Column<int>(type: "INTEGER", nullable: true),
                    direccion_envio_id = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__ventas__B135080906DF1020", x => x.venta_id);
                    table.ForeignKey(
                        name: "FK__ventas__direccio__5FB337D6",
                        column: x => x.direccion_envio_id,
                        principalTable: "direcciones_usuarios",
                        principalColumn: "direccion_id");
                    table.ForeignKey(
                        name: "FK__ventas__estado_i__5EBF139D",
                        column: x => x.estado_id,
                        principalTable: "estados_venta",
                        principalColumn: "estado_id");
                    table.ForeignKey(
                        name: "FK__ventas__usuario___5DCAEF64",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id");
                });

            migrationBuilder.CreateTable(
                name: "mensajes_ticket",
                columns: table => new
                {
                    mensaje_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ticket_id = table.Column<int>(type: "INTEGER", nullable: true),
                    usuario_id = table.Column<Guid>(type: "TEXT", nullable: true),
                    contenido = table.Column<string>(type: "text", nullable: true),
                    fecha_envio = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__mensajes__6B304DCDEFFC63D8", x => x.mensaje_id);
                    table.ForeignKey(
                        name: "FK__mensajes___ticke__6EF57B66",
                        column: x => x.ticket_id,
                        principalTable: "tickets_soporte",
                        principalColumn: "ticket_id");
                    table.ForeignKey(
                        name: "FK__mensajes___usuar__6FE99F9F",
                        column: x => x.usuario_id,
                        principalTable: "usuarios",
                        principalColumn: "usuario_id");
                });

            migrationBuilder.CreateTable(
                name: "carrito_items",
                columns: table => new
                {
                    item_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    carrito_id = table.Column<int>(type: "INTEGER", nullable: true),
                    impresora_id = table.Column<int>(type: "INTEGER", nullable: true),
                    cantidad = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__carrito___52020FDD15942EA5", x => x.item_id);
                    table.ForeignKey(
                        name: "FK__carrito_i__carri__534D60F1",
                        column: x => x.carrito_id,
                        principalTable: "carritos",
                        principalColumn: "carrito_id");
                    table.ForeignKey(
                        name: "FK__carrito_i__impre__5441852A",
                        column: x => x.impresora_id,
                        principalTable: "impresoras_personalizadas",
                        principalColumn: "impresora_id");
                });

            migrationBuilder.CreateTable(
                name: "detalle_venta",
                columns: table => new
                {
                    detalle_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    venta_id = table.Column<int>(type: "INTEGER", nullable: true),
                    impresora_id = table.Column<int>(type: "INTEGER", nullable: true),
                    cantidad = table.Column<int>(type: "INTEGER", nullable: true),
                    precio_unitario = table.Column<decimal>(type: "decimal(10, 2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__detalle___91B12E7087ED20B4", x => x.detalle_id);
                    table.ForeignKey(
                        name: "FK__detalle_v__impre__6383C8BA",
                        column: x => x.impresora_id,
                        principalTable: "impresoras_personalizadas",
                        principalColumn: "impresora_id");
                    table.ForeignKey(
                        name: "FK__detalle_v__venta__628FA481",
                        column: x => x.venta_id,
                        principalTable: "ventas",
                        principalColumn: "venta_id");
                });

            migrationBuilder.CreateTable(
                name: "pagos",
                columns: table => new
                {
                    pago_id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    venta_id = table.Column<int>(type: "INTEGER", nullable: true),
                    medio_pago_id = table.Column<int>(type: "INTEGER", nullable: true),
                    fecha_pago = table.Column<DateTime>(type: "datetime", nullable: true),
                    monto = table.Column<decimal>(type: "decimal(10, 2)", nullable: true),
                    estado = table.Column<string>(type: "TEXT", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__pagos__FFF0A58E3A93F693", x => x.pago_id);
                    table.ForeignKey(
                        name: "FK__pagos__medio_pag__693CA210",
                        column: x => x.medio_pago_id,
                        principalTable: "medios_pago",
                        principalColumn: "medio_pago_id");
                    table.ForeignKey(
                        name: "FK__pagos__venta_id__68487DD7",
                        column: x => x.venta_id,
                        principalTable: "ventas",
                        principalColumn: "venta_id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_carrito_items_carrito_id",
                table: "carrito_items",
                column: "carrito_id");

            migrationBuilder.CreateIndex(
                name: "IX_carrito_items_impresora_id",
                table: "carrito_items",
                column: "impresora_id");

            migrationBuilder.CreateIndex(
                name: "IX_carritos_usuario_id",
                table: "carritos",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_detalle_venta_impresora_id",
                table: "detalle_venta",
                column: "impresora_id");

            migrationBuilder.CreateIndex(
                name: "IX_detalle_venta_venta_id",
                table: "detalle_venta",
                column: "venta_id");

            migrationBuilder.CreateIndex(
                name: "IX_direcciones_usuarios_usuario_id",
                table: "direcciones_usuarios",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_favoritos_usuarios_producto_id",
                table: "favoritos_usuarios",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "IX_favoritos_usuarios_usuario_id",
                table: "favoritos_usuarios",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_historial_navegacion_usuario_id",
                table: "historial_navegacion",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_impresoras_personalizadas_producto_id",
                table: "impresoras_personalizadas",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "IX_impresoras_personalizadas_usuario_id",
                table: "impresoras_personalizadas",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_logs_ia_respuesta_id",
                table: "logs_ia",
                column: "respuesta_id");

            migrationBuilder.CreateIndex(
                name: "IX_logs_ia_usuario_id",
                table: "logs_ia",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_mensajes_ticket_ticket_id",
                table: "mensajes_ticket",
                column: "ticket_id");

            migrationBuilder.CreateIndex(
                name: "IX_mensajes_ticket_usuario_id",
                table: "mensajes_ticket",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_opciones_componentes_componente_id",
                table: "opciones_componentes",
                column: "componente_id");

            migrationBuilder.CreateIndex(
                name: "IX_pagos_medio_pago_id",
                table: "pagos",
                column: "medio_pago_id");

            migrationBuilder.CreateIndex(
                name: "IX_pagos_venta_id",
                table: "pagos",
                column: "venta_id");

            migrationBuilder.CreateIndex(
                name: "IX_productos_categoria_id",
                table: "productos",
                column: "categoria_id");

            migrationBuilder.CreateIndex(
                name: "IX_resenas_productos_producto_id",
                table: "resenas_productos",
                column: "producto_id");

            migrationBuilder.CreateIndex(
                name: "IX_resenas_productos_usuario_id",
                table: "resenas_productos",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_tickets_soporte_usuario_id",
                table: "tickets_soporte",
                column: "usuario_id");

            migrationBuilder.CreateIndex(
                name: "IX_usuario_roles_rol_id",
                table: "usuario_roles",
                column: "rol_id");

            migrationBuilder.CreateIndex(
                name: "UQ__usuarios__AB6E6164050A4AD0",
                table: "usuarios",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ventas_direccion_envio_id",
                table: "ventas",
                column: "direccion_envio_id");

            migrationBuilder.CreateIndex(
                name: "IX_ventas_estado_id",
                table: "ventas",
                column: "estado_id");

            migrationBuilder.CreateIndex(
                name: "IX_ventas_usuario_id",
                table: "ventas",
                column: "usuario_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "carrito_items");

            migrationBuilder.DropTable(
                name: "consultas_contacto");

            migrationBuilder.DropTable(
                name: "detalle_venta");

            migrationBuilder.DropTable(
                name: "favoritos_usuarios");

            migrationBuilder.DropTable(
                name: "historial_navegacion");

            migrationBuilder.DropTable(
                name: "logs_ia");

            migrationBuilder.DropTable(
                name: "mensajes_ticket");

            migrationBuilder.DropTable(
                name: "newsletter_suscripciones");

            migrationBuilder.DropTable(
                name: "opciones_componentes");

            migrationBuilder.DropTable(
                name: "pagos");

            migrationBuilder.DropTable(
                name: "resenas_productos");

            migrationBuilder.DropTable(
                name: "simple_cart_items");

            migrationBuilder.DropTable(
                name: "usuario_roles");

            migrationBuilder.DropTable(
                name: "carritos");

            migrationBuilder.DropTable(
                name: "impresoras_personalizadas");

            migrationBuilder.DropTable(
                name: "respuestas_ia");

            migrationBuilder.DropTable(
                name: "tickets_soporte");

            migrationBuilder.DropTable(
                name: "componentes_personalizables");

            migrationBuilder.DropTable(
                name: "medios_pago");

            migrationBuilder.DropTable(
                name: "ventas");

            migrationBuilder.DropTable(
                name: "roles");

            migrationBuilder.DropTable(
                name: "productos");

            migrationBuilder.DropTable(
                name: "direcciones_usuarios");

            migrationBuilder.DropTable(
                name: "estados_venta");

            migrationBuilder.DropTable(
                name: "categorias_productos");

            migrationBuilder.DropTable(
                name: "usuarios");
        }
    }
}
