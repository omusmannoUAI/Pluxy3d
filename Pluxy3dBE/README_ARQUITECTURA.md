# Pluxy3D Backend - Arquitectura Moderna

## 📋 Descripción

Pluxy3D Backend es una API REST moderna desarrollada con .NET 9 y C# 13, siguiendo las mejores prácticas de arquitectura en capas y principios SOLID. La aplicación está diseñada para ser escalable, mantenible y fácil de testear.

## 🏗️ Arquitectura

### Estructura de Proyectos

```
Pluxy3dBE/                          # Proyecto principal (API)
├── Controllers/                    # Controladores REST
├── Middlewares/                    # Middlewares personalizados
├── DTOs/                          # Data Transfer Objects
├── Properties/                    # Configuraciones de launch
└── Program.cs                     # Punto de entrada

Pluxy3dBE.Entities/                # Entidades de dominio (24 entidades de BD)
├── Carrito.cs
├── CarritoItem.cs
├── CategoriasProducto.cs
├── ComponentesPersonalizable.cs
├── ConsultasContacto.cs
├── DetalleVentum.cs
├── DireccionesUsuario.cs
├── EstadosVentum.cs
├── FavoritosUsuario.cs
├── HistorialNavegacion.cs
├── ImpresorasPersonalizada.cs
├── LogsIum.cs
├── MediosPago.cs
├── MensajesTicket.cs
├── NewsletterSuscripcione.cs
├── OpcionesComponente.cs
├── Pago.cs
├── Producto.cs
├── ResenasProducto.cs
├── RespuestasIum.cs
├── Role.cs
├── TicketsSoporte.cs
├── Usuario.cs
└── Venta.cs

Pluxy3dBE.DalContracts/           # Contratos de capa de datos
├── IRepository.cs                # Repositorio genérico
├── IProductoRepository.cs
├── ICarritoRepository.cs
├── IUsuarioRepository.cs
└── IVentaRepository.cs           # Renombrado de IOrdenRepository

Pluxy3dBE.Repository/             # Implementación de repositorios
├── Data/
│   └── AppDbContextFromDb.cs    # Contexto EF generado desde BD
├── BaseRepository.cs            # Repositorio base genérico (pendiente)
├── ProductoRepository.cs        # (pendiente de implementar)
└── CarritoRepository.cs         # (pendiente de implementar)

Pluxy3dBE.DomainContracts/        # Contratos de servicios de dominio
├── DTOs/                        # DTOs específicos del dominio
├── Services/                    # Interfaces de servicios
│   ├── IProductoService.cs
│   └── ICarritoService.cs

Pluxy3dBE.Domain/                 # Lógica de negocio
├── Services/                    # Implementación de servicios
│   ├── ProductoService.cs
│   └── CarritoService.cs
├── Mappings/                    # Perfiles de AutoMapper
│   ├── ProductoProfile.cs
│   └── CarritoProfile.cs

Pluxy3dBE.Composition/           # Inyección de dependencias
├── Modules/                     # Módulos de Autofac
│   ├── RepositoryModule.cs
│   └── DomainModule.cs
└── CompositionRoot.cs          # Configuración principal
```

## 🚀 Características

### Tecnologías Utilizadas

- **.NET 9** con **C# 13**
- **Entity Framework Core 9** para acceso a datos
- **Autofac** para inyección de dependencias
- **AutoMapper** para mapeo de objetos
- **Serilog** para logging estructurado
- **Swagger/OpenAPI** para documentación
- **FluentValidation** para validaciones (preparado)
- **Health Checks** para monitoreo

### Patrones y Principios

- **Arquitectura en Capas (Layered Architecture)**
- **Repository Pattern** con repositorio genérico
- **Service Layer Pattern**
- **Dependency Injection** con Autofac
- **SOLID Principles**
- **Clean Code**
- **Async/Await** en toda la aplicación

## 🛠️ Configuración y Ejecución

### Prerrequisitos

- .NET 9 SDK
- SQL Server o SQLite
- Visual Studio 2022 o VS Code

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone [url-del-repositorio]
   cd Pluxy3d
   ```

2. **Restaurar paquetes**
   ```bash
   dotnet restore
   ```

3. **Configurar base de datos**
   - Editar `appsettings.Development.json`
   - Configurar connection string según tu entorno

4. **Ejecutar migraciones** (si es necesario)
   ```bash
   dotnet ef database update
   ```

5. **Ejecutar la aplicación**
   ```bash
   dotnet run --project Pluxy3dBE
   ```

### Perfiles de Ejecución

El proyecto incluye múltiples perfiles configurados en `launchSettings.json`:

- **http**: Desarrollo HTTP (puerto 5299)
- **https**: Desarrollo HTTPS (puerto 7001)
- **IIS Express**: Para desarrollo con IIS
- **Production**: Configuración de producción
- **Staging**: Configuración de staging

### Variables de Entorno

```env
ASPNETCORE_ENVIRONMENT=Development
LOG_LEVEL=Information
DATABASE_CONNECTION=Server=...;Database=Pluxy3d;...
ENABLE_SWAGGER=true
CORS_ORIGINS=http://localhost:3000;https://localhost:3001
```

## 📖 API Endpoints

### Productos

```http
GET    /api/productos              # Obtener todos los productos
GET    /api/productos/{id}         # Obtener producto por ID
GET    /api/productos/search       # Buscar productos
GET    /api/productos/categoria/{categoria}  # Productos por categoría
GET    /api/productos/categorias   # Listar categorías
GET    /api/productos/marcas       # Listar marcas
POST   /api/productos              # Crear producto
PUT    /api/productos/{id}         # Actualizar producto
DELETE /api/productos/{id}         # Eliminar producto
```

### Carrito

```http
GET    /api/carrito               # Obtener carrito actual
POST   /api/carrito/items         # Agregar item al carrito
PUT    /api/carrito/items/{id}    # Actualizar cantidad
DELETE /api/carrito/items/{id}    # Eliminar item
DELETE /api/carrito               # Limpiar carrito
```

### Health Checks

```http
GET    /health                    # Estado de la aplicación
```

## 🔧 Configuración Avanzada

### Logging con Serilog

La aplicación utiliza Serilog para logging estructurado:

```json
{
  "Serilog": {
    "MinimumLevel": "Information",
    "WriteTo": [
      { "Name": "Console" },
      { 
        "Name": "File", 
        "Args": { 
          "path": "logs/pluxy3d-.txt",
          "rollingInterval": "Day" 
        } 
      }
    ]
  }
}
```

### CORS

Configurado para permitir requests desde el frontend Next.js:

```csharp
app.UseCors("AllowFrontend");
```

### Caché

Implementado con:
- **Memory Cache** para datos frecuentemente accedidos
- **Response Caching** para endpoints HTTP

### Compresión

Habilitada compresión de respuestas para mejorar el rendimiento.

## 🧪 Testing

### Estructura de Tests (Preparada)

```
tests/
├── Pluxy3dBE.UnitTests/
├── Pluxy3dBE.IntegrationTests/
└── Pluxy3dBE.PerformanceTests/
```

### Comandos de Testing

```bash
# Ejecutar todos los tests
dotnet test

# Ejecutar con cobertura
dotnet test --collect:"XPlat Code Coverage"

# Ejecutar tests específicos
dotnet test --filter "Category=Unit"
```

## 📝 Buenas Prácticas Implementadas

### 1. Separación de Responsabilidades
- **Controladores**: Solo manejo de HTTP
- **Servicios**: Lógica de negocio
- **Repositorios**: Acceso a datos
- **DTOs**: Transferencia de datos

### 2. Manejo de Errores
- Middleware global de excepciones
- Logging estructurado
- Respuestas consistentes

### 3. Validación
- Preparado para FluentValidation
- Validación en DTOs
- Validación en controladores

### 4. Documentación
- Swagger/OpenAPI automático
- Comentarios XML
- Documentación de endpoints

### 5. Seguridad
- CORS configurado
- Preparado para autenticación JWT
- HTTPS habilitado

## 🔄 Estado Actual de la Migración

La arquitectura ha sido exitosamente reorganizada según los principios de Clean Architecture:

### ✅ **COMPLETADO:**

1. **✅ Entidades de Base de Datos:**
   - 24 entidades generadas desde la BD real (Database-First)
   - Todas ubicadas correctamente en `Pluxy3dBE.Entities`
   - Relaciones y navegación configuradas automáticamente

2. **✅ Contratos de Datos:**
   - Interfaces de repositorio en `Pluxy3dBE.DalContracts`
   - Repositorio genérico `IRepository<T>`
   - Contratos específicos para cada entidad principal

3. **✅ Contexto de Base de Datos:**
   - `AppDbContextFromDb` generado automáticamente
   - Configurado para SQL Server (TUCHOPC\SQLEXPRESS)
   - 24 DbSets configurados correctamente

4. **✅ Capa de Dominio:**
   - Servicios de negocio implementados
   - DTOs organizados en `Pluxy3dBE.DomainContracts`
   - AutoMapper configurado para las nuevas entidades

5. **✅ Inyección de Dependencias:**
   - Autofac configurado en `Pluxy3dBE.Composition`
   - Módulos organizados por responsabilidad

### 🔄 **EN PROGRESO:**

1. **Migración de Controladores Legacy:**
   - Actualizar referencias de `Pluxy3dBE.Models` → `Pluxy3dBE.Entities`
   - Corregir uso de `AppDbContext` → `AppDbContextFromDb`
   - Adaptar lógica a la nueva estructura de datos

2. **Implementación de Repositorios:**
   - Crear implementaciones concretas de repositorios
   - Adaptar a la estructura real de la BD (ej: CarritoItem → ImpresorasPersonalizada)

### ⏳ **PENDIENTE:**

1. **Autenticación y Autorización:**
   - Implementar JWT con la entidad `Usuario` real
   - Configurar roles usando la entidad `Role`

2. **Validaciones:**
   - FluentValidation para DTOs
   - Validaciones de negocio en servicios

3. **Testing:**
   - Tests unitarios para servicios
   - Tests de integración para repositorios

### 📊 **Arquitectura Real vs Documentada:**

La estructura real incluye entidades específicas del dominio de impresión 3D:
- `ImpresorasPersonalizada`: Configuraciones personalizadas de impresoras
- `ComponentesPersonalizable`: Componentes configurables
- `CategoriasProducto`: Categorización de productos
- `EstadosVentum`: Estados del proceso de venta
- `TicketsSoporte`: Sistema de soporte integrado
- `NewsletterSuscripcione`: Marketing integrado

## 🚀 Próximos Pasos

1. **Migrar controladores existentes** a la nueva arquitectura
2. **Implementar autenticación JWT**
3. **Agregar validaciones con FluentValidation**
4. **Implementar tests unitarios e integración**
5. **Configurar CI/CD**
6. **Agregar métricas y monitoreo**

## 📚 Recursos y Referencias

- [.NET 9 Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [Autofac Documentation](https://autofac.readthedocs.io/)
- [Serilog Documentation](https://serilog.net/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**Desarrollado por el Equipo Pluxy3D** 🚀
