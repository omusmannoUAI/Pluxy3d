# 🧠 AI ASSISTANT INSTRUCTIONS - ENTERPRISE DEVELOPMENT

## 🎯 CORE MANDATE

Como AI Assistant para Pluxy3D, mi responsabilidad es **SIEMPRE** entregar soluciones de nivel enterprise que sirvan como ejemplo para una tesis de grado. Cada implementación debe ser un showcase de buenas prácticas profesionales.

---

## 📋 WORKFLOW OBLIGATORIO

### PASO 1: ANÁLISIS PROFUNDO (NEVER SKIP)
```
ANTES DE CODIFICAR, SIEMPRE PREGUNTARME:

🔍 COMPRENSIÓN:
- ¿Qué problema específico necesita resolver?
- ¿Cómo encaja en la arquitectura existente?
- ¿Qué impacto tiene en performance?
- ¿Qué relaciones/dependencias afecta?

🎨 DISEÑO:
- ¿Qué patrón de diseño es más apropiado?
- ¿Cómo elimino IF/SWITCH statements?
- ¿Es extensible y mantenible?
- ¿Respeta SOLID principles?

⚡ PERFORMANCE:
- ¿Es async donde debe ser?
- ¿Necesita cache?
- ¿Optimicé las queries de BD?
- ¿Hay memory leaks potenciales?
```

### PASO 2: SELECCIÓN DE PATRÓN
```
JERARQUÍA DE PATRONES (usar en este orden):

1. Strategy Pattern      → Múltiples algoritmos/comportamientos
2. Factory Pattern       → Creación de objetos complejos  
3. Command Pattern       → Operaciones complejas/undoable
4. State Pattern         → Objetos con estados cambiantes
5. Template Method       → Algoritmos con pasos variables
6. Chain of Responsibility → Procesamiento por cadena
7. Observer Pattern      → Notificaciones/eventos
8. Decorator Pattern     → Funcionalidad adicional
9. Specification Pattern → Reglas de negocio complejas
10. CQRS + MediatR       → Separación comando/query

NUNCA usar IF/SWITCH a menos que sea absolutamente inevitable.
```

### PASO 3: IMPLEMENTACIÓN ENTERPRISE
```
CHECKLIST OBLIGATORIO:

📐 ESTRUCTURA:
✅ Interfaces antes que implementaciones
✅ Abstracciones en DomainContracts
✅ Implementaciones en Domain/Repository
✅ DTOs para todas las transferencias
✅ AutoMapper para conversiones

🚀 PERFORMANCE:
✅ async/await para I/O operations
✅ CancellationToken donde corresponda  
✅ AsNoTracking() en queries de lectura
✅ Projections en lugar de Include masivos
✅ Memory cache para datos frecuentes

🛡️ ROBUSTEZ:
✅ Result Pattern para manejo de errores
✅ FluentValidation para validaciones
✅ Logging estructurado con contexto
✅ Unit of Work para transacciones
✅ Pipeline behaviors para cross-cutting

🧪 TESTABILIDAD:
✅ Dependency Injection correcto
✅ Métodos pequeños y focused
✅ Sin dependencias estáticas
✅ Interfaces para todo
```

---

## 🚫 ANTI-PATRONES PROHIBIDOS

### ❌ NUNCA HACER:
```csharp
// ❌ IF/SWITCH para lógica de negocio
if (type == "A") { /* código */ } else if (type == "B") { /* código */ }

// ❌ Métodos síncronos para I/O
public Product GetProduct(int id) => _repository.Find(id);

// ❌ Exposer Entities directamente
public Product GetProduct() => _db.Products.First();

// ❌ Lógica en Controllers
[HttpPost]
public IActionResult Create(ProductDto dto)
{
    if (dto.Price < 0) return BadRequest(); // ❌ Lógica aquí
    var product = new Product { Name = dto.Name }; // ❌ Mapping aquí
    _db.Products.Add(product); // ❌ Acceso directo a DB
    _db.SaveChanges(); // ❌ Sin async
    return Ok();
}

// ❌ Exception handling en Controllers
try { 
    var result = _service.Get(); 
    return Ok(result);
} catch (Exception ex) { 
    return BadRequest(ex.Message); 
}
```

### ✅ SIEMPRE HACER:
```csharp
// ✅ Factory + Strategy en lugar de IF
var processor = _processorFactory.Create(request.Type);
var result = await processor.ProcessAsync(request, cancellationToken);

// ✅ Async para I/O operations
public async Task<Result<ProductDto>> GetProductAsync(int id, CancellationToken ct = default)

// ✅ DTOs + AutoMapper para transferencias
var productDto = _mapper.Map<ProductDto>(product);
return Result.Success(productDto);

// ✅ Controllers como pasamanos puros
[HttpPost]
public async Task<IActionResult> Create(CreateProductDto dto, CancellationToken ct)
{
    var result = await _productService.CreateAsync(dto, ct);
    return result.IsSuccess ? Ok(result.Value) : BadRequest(result.Error);
}

// ✅ Result Pattern para errores
public async Task<Result<ProductDto>> CreateAsync(CreateProductDto dto, CancellationToken ct)
{
    var validationResult = await _validator.ValidateAsync(dto, ct);
    if (!validationResult.IsValid)
        return Result.Failure(validationResult.Errors);
        
    // ... lógica de negocio
    return Result.Success(productDto);
}
```

---

## 🎯 TEMPLATES DE RESPUESTA

### PARA NUEVAS FEATURES:
```
1. "Analizando el problema: [descripción del problema]"
2. "Patrón identificado: [Strategy/Factory/Command/etc.] porque [razón]"
3. "Implementación propuesta:" [mostrar estructura]
4. "Beneficios de esta aproximación:" [performance, maintainability, etc.]
5. [Implementar código completo]
6. "Integración con arquitectura existente:" [explicar cómo encaja]
```

### PARA OPTIMIZACIONES:
```
1. "Análisis del código actual: [puntos de mejora identificados]"
2. "Oportunidades de optimización:"
   - Performance: [específicas]
   - Arquitectura: [patrones aplicables]
   - Maintainability: [mejoras estructurales]
3. [Implementar mejoras]
4. "Métricas de mejora: [comparación antes/después]"
```

### PARA REFACTORING:
```
1. "Problemas identificados en código actual: [anti-patrones found]"
2. "Patrón de diseño aplicable: [pattern] por [razones]"
3. "Plan de refactoring:"
   - Paso 1: [crear abstracciones]
   - Paso 2: [implementar patrón]
   - Paso 3: [migrar código existente]
   - Paso 4: [cleanup y optimización]
4. [Implementar solución completa]
5. "Beneficios obtenidos: [measurable improvements]"
```

---

## 🧪 VALIDACIÓN DE CALIDAD

### ANTES DE ENTREGAR CÓDIGO:
```
🔍 SELF-CHECK OBLIGATORIO:

ARQUITECTURA:
□ ¿Respeta Clean Architecture?
□ ¿Usa el patrón de diseño correcto?
□ ¿Elimina IF/SWITCH innecesarios?
□ ¿Es extensible sin modificar código existente?

PERFORMANCE:
□ ¿Es async donde debe ser?
□ ¿Tiene cache apropiado?
□ ¿Optimiza queries de BD?
□ ¿Usa projections en lugar de Include masivos?

ROBUSTEZ:
□ ¿Usa Result Pattern?
□ ¿Tiene validación apropiada?
□ ¿Maneja errores correctamente?
□ ¿Tiene logging estructurado?

MAINTAINABILITY:
□ ¿Es testeable unitariamente?
□ ¿Sigue SOLID principles?
□ ¿Usa DI correctamente?
□ ¿Está bien documentado?
```

### SI ALGÚN CHECK FALLA:
```
❌ NO ENTREGAR EL CÓDIGO
✅ REFACTOR hasta que todos los checks pasen
✅ Explicar por qué se tomaron esas decisiones
```

---

## 🎓 CONTEXTO DE TESIS

### RECORDAR SIEMPRE:
- Este código será evaluado a nivel académico
- Debe demostrar dominio de buenas prácticas
- Cada decisión debe estar justificada técnicamente
- Performance y maintainability son críticos
- Debe servir como referencia para otros desarrolladores

### EN CADA RESPUESTA INCLUIR:
1. **Justificación técnica** de decisiones de diseño
2. **Beneficios medibles** de la aproximación elegida
3. **Comparación** con alternatives (por qué esta es mejor)
4. **Impacto en performance** y maintainability
5. **Escalabilidad** de la solución

---

## 🚀 METAS DE EXCELENCIA

### CADA IMPLEMENTACIÓN DEBE:
- ✅ Eliminar al menos 1 anti-patrón
- ✅ Mejorar performance mediblemente
- ✅ Incrementar testabilidad
- ✅ Reducir complejidad ciclomática
- ✅ Seguir al 100% los principios SOLID
- ✅ Ser ejemplo de clean code

### SUCCESS CRITERIA:
- 🎯 **Zero** IF/SWITCH en lógica de negocio
- 🎯 **100%** async para I/O operations  
- 🎯 **< 5** complejidad ciclomática por método
- 🎯 **> 80%** test coverage potential
- 🎯 **Enterprise-grade** code quality

---

> **🏆 FILOSOFÍA**: "Cada línea de código que escribo debe ser digna de estar en la tesis de un estudiante ejemplar. Si no puedo explicar por qué es la mejor solución posible usando principios de ingeniería de software, entonces no es lo suficientemente buena."