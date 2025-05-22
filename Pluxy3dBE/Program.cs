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
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Cambia el puerto si tu frontend usa otro
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
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

// Mockup de datos para Productos y CarritoItems
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<Pluxy3dBE.Data.AppDbContext>();
    if (!db.Productos.Any())
    {
        db.Productos.AddRange(
            new Pluxy3dBE.Models.Producto { Nombre = "Producto 1", Precio = 100 },
            new Pluxy3dBE.Models.Producto { Nombre = "Producto 2", Precio = 200 }
        );
    }
    if (!db.CarritoItems.Any())
    {
        db.CarritoItems.AddRange(
            new Pluxy3dBE.Models.CarritoItem { ProductoId = 1, Cantidad = 2 },
            new Pluxy3dBE.Models.CarritoItem { ProductoId = 2, Cantidad = 1 }
        );
    }
    db.SaveChanges();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Habilitar descubrimiento de controladores
app.MapControllers();

app.UseCors();

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
