# Pluxy3D

Quickstart
- Backend: `dotnet run --project Pluxy3dBE/Pluxy3dBE.csproj`
- Frontend: en `pluxy3d/` usar `npm i` y `npm run dev` (o pnpm si lo tienes)
- Abrir: http://localhost:3000 y Swagger en http://localhost:5299/swagger

Env
- NEXT_PUBLIC_API_URL=http://localhost:5299/api

Arquitectura
- Clean Architecture con proyectos Entities, Repository, Domain, DomainContracts, Composition y API.
- Patrones: Repository + Service (Carrito), DI con Autofac, logging con Serilog.

API Carrito (in-memory)
- GET    /api/carrito
- GET    /api/carrito/{id}
- POST   /api/carrito { productId, quantity }
- PUT    /api/carrito/{id} (body: número con la cantidad)
- DELETE /api/carrito/{id}
- DELETE /api/carrito/clear