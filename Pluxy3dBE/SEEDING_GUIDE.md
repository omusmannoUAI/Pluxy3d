# Cómo poblar la base de datos con productos

## Opción 1: Usar el controlador SeedController (Recomendado)

1. **Inicia el backend**:
   ```bash
   cd c:\Users\Pluxy\source\repos\Pluxy3d\Pluxy3dBE
   dotnet run
   ```

2. **Poblar la base de datos** (usando PowerShell):
   ```powershell
   # Limpiar base de datos actual
   Invoke-WebRequest -Uri "http://localhost:5000/api/seed/clear" -Method Post

   # Poblar con nuevos productos
   Invoke-WebRequest -Uri "http://localhost:5000/api/seed/productos" -Method Post

   # Verificar estadísticas
   Invoke-WebRequest -Uri "http://localhost:5000/api/seed/stats" -Method Get | ConvertFrom-Json
   ```

3. **Verificar productos cargados**:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:5000/api/productos" -Method Get | ConvertFrom-Json
   ```

## Opción 2: Agregar productos manualmente

Puedes usar el endpoint POST `/api/productos` para agregar productos individuales:

```powershell
$producto = @{
    nombre = "Nombre del Producto"
    descripcion = "Descripción detallada"
    precio = 50000
    image = "/imagen.jpg"
    categoria = "impresora"  # o "componente", "filamento", "accesorio"
    marca = "MarcaEjemplo"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/productos" -Method Post -Body $producto -ContentType "application/json"
```

## Productos incluidos en el seed

### Impresoras 3D:
- Creality Ender 3 V2 - $295.000
- Creality Ender 3 Pro - $275.000  
- Artillery Sidewinder X1 - $420.000
- Anycubic Kobra 2 - $320.000

### Componentes:
- Kit Mejora Ender 3 - $45.000
- Sistema Doble Tracción Z - $38.000
- Hotend V6 Todo Metal - $28.000
- Placa PEI Magnética - $15.000

### Filamentos:
- PLA+ 1kg Blanco - $8.500
- ABS 1kg Negro - $9.500
- PETG 1kg Transparente - $12.000

### Accesorios:
- Kit Herramientas - $6.500
- Boquillas Pack x10 - $4.500
- Sensor BLTouch - $35.000

## Endpoints disponibles:

- `POST /api/seed/productos` - Poblar productos
- `POST /api/seed/clear` - Limpiar base de datos
- `GET /api/seed/stats` - Ver estadísticas
- `GET /api/productos` - Ver todos los productos
- `POST /api/productos` - Agregar producto individual

## Notas importantes:

1. Los precios están en pesos argentinos (ARS)
2. Las categorías disponibles son: "impresora", "componente", "filamento", "accesorio"
3. El endpoint `/api/seed/productos` limpia todos los productos existentes antes de agregar los nuevos
4. El endpoint `/api/seed/clear` también limpia los items del carrito para evitar errores de integridad
