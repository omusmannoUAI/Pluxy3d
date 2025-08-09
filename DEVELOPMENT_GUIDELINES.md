# 🏗️ DEVELOPMENT GUIDELINES - Pluxy3d

## 📋 PRINCIPIOS FUNDAMENTALES

### 🎯 ARQUITECTURA OBLIGATORIA
- **Clean Architecture** con 6 proyectos modulares
- **Separación estricta** de responsabilidades
- **Flujo unidireccional** de dependencias

### 🔄 FLUJO DE DATOS OBLIGATORIO
```
Frontend → Controller → Service → Repository → Database
Frontend ← Controller ← Service ← Repository ← Database
```

---

## 🚀 IMPLEMENTACIÓN DE NUEVAS FUNCIONES

### ✅ CUANDO SE SOLICITE UNA NUEVA FUNCIÓN:

#### 1. **RAMIFICACIÓN COMPLETA OBLIGATORIA**
- ✅ **Frontend**: Componente/página funcional
- ✅ **Controller**: Endpoint REST API
- ✅ **Service**: Lógica de negocio
- ✅ **Repository**: Acceso a datos
- ✅ **DTOs**: Objetos de transferencia
- ✅ **Entities**: Si es necesario

#### 2. **NO USAR MOCKS EN CÓDIGO**
- ❌ **Prohibido**: Mocks en Services/Repositories
- ✅ **Obligatorio**: Datos reales desde base de datos
- ✅ **Si no hay datos**: Crear registros mock en BD

#### 3. **DISTRIBUCIÓN DE RESPONSABILIDADES**

##### 🎭 **Controllers** (Solo pasamanos)
```csharp
// ✅ CORRECTO - Solo pasamanos
[HttpGet]
public async Task<ActionResult<List<ProductoDto>>> GetProductos()
{
    var productos = await _productoService.GetProductosAsync();
    return Ok(productos);
}

// ❌ INCORRECTO - Lógica en controller
[HttpGet]
public async Task<ActionResult<List<ProductoDto>>> GetProductos()
{
    if (condition) { /* lógica aquí */ }  // ❌ NO
}
```

##### 🧠 **Services** (Lógica del sistema)
```csharp
// ✅ CORRECTO - Orquesta y delega
public async Task<List<ProductoDto>> GetProductosAsync()
{
    var productos = await _productoRepository.GetAllAsync();
    var productosDto = _mapper.Map<List<ProductoDto>>(productos);
    
    // Aplicar reglas de negocio
    await _businessRuleService.ApplyVisibilityRules(productosDto);
    
    return productosDto;
}
```

##### 🗄️ **Repositories** (Solo acceso a datos)
```csharp
// ✅ CORRECTO - Solo operaciones de BD
public async Task<List<Producto>> GetAllAsync()
{
    return await _context.Productos
        .Include(p => p.Categoria)
        .ToListAsync();
}
```

---

## 🏛️ PATRONES DE DISEÑO OBLIGATORIOS

### 🚫 **EVITAR A TODA COSTA**
- ❌ **Múltiples IF/SWITCH** en versión final
- ❌ **Lógica hardcodeada**
- ❌ **Coupling alto**

### ✅ **IMPLEMENTAR SIEMPRE**

#### 1. **Strategy Pattern** (en lugar de IF/SWITCH)
```csharp
// ✅ En lugar de múltiples IF
public interface IPaymentProcessor
{
    Task<PaymentResult> ProcessAsync(PaymentRequest request);
}

public class CreditCardProcessor : IPaymentProcessor { }
public class PayPalProcessor : IPaymentProcessor { }
```

#### 2. **Factory Pattern** (para creación de objetos)
```csharp
public interface IPaymentProcessorFactory
{
    IPaymentProcessor Create(PaymentType type);
}
```

#### 3. **Repository Pattern** (ya implementado)
```csharp
public interface IGenericRepository<T> where T : class
{
    Task<T> GetByIdAsync(int id);
    Task<List<T>> GetAllAsync();
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
}
```

#### 4. **Unit of Work Pattern**
```csharp
public interface IUnitOfWork
{
    IProductoRepository Productos { get; }
    IUsuarioRepository Usuarios { get; }
    Task<int> SaveChangesAsync();
}
```

#### 5. **CQRS Pattern** (para operaciones complejas)
```csharp
// Commands (escritura)
public interface ICommand<TResult> { }
public interface ICommandHandler<TCommand, TResult> { }

// Queries (lectura)
public interface IQuery<TResult> { }
public interface IQueryHandler<TQuery, TResult> { }
```

---

## 📁 ESTRUCTURA OBLIGATORIA

### 🏗️ **Proyectos y Ubicaciones**
```
Pluxy3dBE.Entities/          ← Entidades de dominio
├── Producto.cs
├── Usuario.cs
└── ...

Pluxy3dBE.DalContracts/      ← Interfaces de repositorios
├── IProductoRepository.cs
└── ...

Pluxy3dBE.Repository/        ← Implementación de repositorios
├── Data/AppDbContextFromDb.cs
├── ProductoRepository.cs
└── ...

Pluxy3dBE.DomainContracts/   ← Interfaces de servicios + DTOs
├── DTOs/
│   ├── ProductoDto.cs
│   └── ...
├── IProductoService.cs
└── ...

Pluxy3dBE.Domain/           ← Implementación de servicios
├── Services/
│   ├── ProductoService.cs
│   └── ...
└── Mappings/
    ├── ProductoProfile.cs
    └── ...

Pluxy3dBE.Composition/      ← Dependency Injection
└── DependencyInjection.cs

Pluxy3dBE/                  ← API Controllers
├── Controllers/
│   ├── ProductosController.cs
│   └── ...
└── Program.cs
```

### 🔄 **Flujo de DTOs**
```csharp
// Repository → Service: Entity se convierte en DTO
Entity → AutoMapper → DTO

// Service → Repository: DTO se convierte en Entity  
DTO → AutoMapper → Entity

// Controller ↔ Service: Solo DTOs (NUNCA Entities)
```

---

## 🎯 REGLAS DE IMPLEMENTACIÓN

### ✅ **AL CREAR NUEVA FUNCIÓN**

1. **Verificar arquitectura existente**
2. **Crear toda la cadena completa**:
   - DTO en `DomainContracts/DTOs/`
   - Interface Service en `DomainContracts/`
   - Service en `Domain/Services/`
   - Interface Repository en `DalContracts/`
   - Repository en `Repository/`
   - Controller en `Pluxy3dBE/Controllers/`
   - AutoMapper profile en `Domain/Mappings/`

3. **Aplicar patrones de diseño apropiados**
4. **Evitar IF/SWITCH en versión final**
5. **Usar datos reales, no mocks**
6. **Seguir principios SOLID**

### 🚫 **NUNCA HACER**
- ❌ Lógica en Controllers
- ❌ Mocks en Services/Repositories
- ❌ Múltiples IF/SWITCH en producción
- ❌ Entities fuera de su proyecto
- ❌ DTOs mezclados con Entities
- ❌ Acceso directo a BD desde Services

---

## 🔍 CHECKLIST DE CALIDAD

### ✅ **Antes de considerar completada una función:**

- [ ] **Arquitectura**: Respeta Clean Architecture
- [ ] **Patrones**: Implementa patrones apropiados
- [ ] **Datos**: Usa datos reales de BD
- [ ] **Separación**: Controllers, Services, Repositories bien separados
- [ ] **DTOs**: Flujo correcto de transformación
- [ ] **Testing**: Funciona end-to-end
- [ ] **Calidad**: Sin IF/SWITCH excesivos
- [ ] **SOLID**: Principios respetados

---

## 🎯 VISIÓN GLOBAL

**Siempre pensar en:**
- 🏗️ **Arquitectura completa** vs cambios locales
- 🔄 **Patrones reutilizables** vs soluciones específicas  
- 📈 **Escalabilidad futura** vs solución rápida
- 🧹 **Código limpio** vs funcionalidad básica

---

> **💡 Recordatorio**: La primera versión puede tener IF simples, pero la versión final DEBE implementar patrones de diseño y buenas prácticas de software.

---

## 🧩 Actualización Agosto 2025

- Se agregó patrón Repository + Service para Carrito:
  - Interfaces: `Pluxy3dBE.Repositories.Cart.ICartRepository`
  - Implementación temporal: `InMemoryCartRepository`
  - Service: `Pluxy3dBE.Services.Cart.CartService`
  - Controller REST: `api/carrito`
- Frontend ahora usa `NEXT_PUBLIC_API_URL` para apuntar al backend (por defecto http://localhost:5299/api)

Cómo probar localmente
- Backend: `dotnet run --project Pluxy3dBE/Pluxy3dBE.csproj`
- Frontend: `npm i` (si no tienes pnpm); `npm run dev` en `pluxy3d/`
- Endpoints: GET/POST/PUT/DELETE `http://localhost:5299/api/carrito`
