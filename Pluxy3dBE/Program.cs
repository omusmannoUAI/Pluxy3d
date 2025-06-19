using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configurar CORS para permitir peticiones desde el frontend Next.js
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

builder.Services.AddDbContext<Pluxy3dBE.Data.AppDbContext>(options =>
    options.UseSqlServer("Server=TUCHOPC\\SQLEXPRESS;Database=Pluxy3d;Trusted_Connection=True;TrustServerCertificate=True;"));

builder.Services.AddScoped<Pluxy3dBE.Repositories.IProductoRepository, Pluxy3dBE.Repositories.ProductoRepository>();
builder.Services.AddScoped<Pluxy3dBE.Services.ProductoService>();
builder.Services.AddAutoMapper(typeof(Pluxy3dBE.Mappings.ProductoProfile));
builder.Services.AddScoped<Pluxy3dBE.Repositories.ICarritoRepository, Pluxy3dBE.Repositories.CarritoRepository>();
builder.Services.AddScoped<Pluxy3dBE.Services.CarritoService>();
builder.Services.AddAutoMapper(typeof(Pluxy3dBE.Mappings.CarritoProfile));
builder.Services.AddControllers();

var app = builder.Build();

// Seed initial product data only (no cart items)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<Pluxy3dBE.Data.AppDbContext>();
    if (!db.Productos.Any())
    {
        db.Productos.AddRange(
            new Pluxy3dBE.Models.Producto { 
                Nombre = "Creality Ender 3 V2", 
                Descripcion = "Impresora 3D de alta calidad para principiantes y profesionales.",
                Precio = 320000,
                Image = "/ender3v2.webp",
                Categoria = "impresora",
                Marca = "Creality"
            },
            new Pluxy3dBE.Models.Producto { 
                Nombre = "Kit Mejora Ender-3", 
                Descripcion = "Kit de mejora para tu impresora Ender 3 con extrusor, teflón y resortes.",
                Precio = 22750,
                Image = "/kitmejora.webp",
                Categoria = "componente",
                Marca = "Creality"
            },
            new Pluxy3dBE.Models.Producto { 
                Nombre = "Kit Doble Tracción", 
                Descripcion = "Sistema de doble tracción para mejorar la precisión de tus impresiones.",
                Precio = 19000,
                Image = "/doble.webp",
                Categoria = "componente",
                Marca = "Creality"
            },
            new Pluxy3dBE.Models.Producto { 
                Nombre = "Hellbot Magna 2", 
                Descripcion = "Impresora 3D de gran formato con doble extrusor y cama caliente.",
                Precio = 450000,
                Image = "/hellbot.png",
                Categoria = "impresora",
                Marca = "Hellbot"
            },
            new Pluxy3dBE.Models.Producto { 
                Nombre = "Prusa i3 MK3S+", 
                Descripcion = "La impresora 3D más confiable del mercado, con excelente calidad de impresión.",
                Precio = 520000,
                Image = "/placeholder.svg",
                Categoria = "impresora",
                Marca = "Prusa"
            },
            new Pluxy3dBE.Models.Producto { 
                Nombre = "HotEnd V6", 
                Descripcion = "HotEnd de alta temperatura para filamentos técnicos y abrasivos.",
                Precio = 15000,
                Image = "/placeholder.svg",
                Categoria = "componente",
                Marca = "Creality"
            }
        );
        db.SaveChanges();    }
    // Always clear any existing cart items to ensure clean state
    var existingCartItems = db.CarritoItems.ToList();
    if (existingCartItems.Any())
    {
        db.CarritoItems.RemoveRange(existingCartItems);
        db.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Usa la política de CORS definida
app.UseCors("AllowFrontend");

// Habilitar descubrimiento de controladores
app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
