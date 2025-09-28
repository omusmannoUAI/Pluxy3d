# Pluxy3D – AI contributor quickstart

Purpose: give ## Integration notes and gotchas
- DI errors: if you see "Cannot resolve parameter ... IVentaRepository", ensure both MS DI and Autofac registrations exist where required (see `Program.cs` custom registrations and `ServiceCollectionExtensions` AddScoped lines).
- Database provider: when `ConnectionStrings:DefaultConnection` looks like `Data Source=...`, the app selects SQLite; otherwise SQL Server (with retry enabled). Keep PendingModelChanges warnings muted via `RelationalEventId.PendingModelChangesWarning` as per current setup.
- Frontend fallbacks: `lib/api.ts` returns empty arrays on timeouts/network errors for `/carrito` and `/productos`. Don't assume non-empty responses in UI components.
- CORS: Allowed origins come from `Cors:AllowedOrigins` in config; in dev, it falls back to AllowAnyOrigin.
- Cart state: `CartContext` loads from localStorage immediately, then syncs with backend in background. Use `refreshCart()` for manual sync.
- API caching: `apiFetch` caches GET responses for 5 minutes by default; use `clearApiCache()` to clear manually.ding agents the minimal but specific context to be productive across this monorepo (Next.js frontend + .NET backend).

## Architecture and boundaries
- Repos root contains two active apps:
  - Backend API: `Pluxy3dBE/` (.NET 8/9 Web API). EF Core DbContext is `Repository/Data/AppDbContextFromDb.cs`. Composition is done via Microsoft DI + Autofac. Request pipeline is centralized in `Extensions/ApplicationBuilderExtensions.cs` and service wiring in `Extensions/ServiceCollectionExtensions.cs`.
  - Frontend: `pluxy3d/` (Next.js 15 + TS + Tailwind). Data fetching centralizes through `pluxy3d/lib/api.ts` and app state for cart via `pluxy3d/contexts/CartContext.tsx`.
- Clean/layered backend structure (examples):
  - Controllers: `Pluxy3dBE/Controllers/**` (e.g. `Cart/CartController.cs`, `ProductsController.cs`). These only orchestrate HTTP and delegate to services.
  - Domain services: `Pluxy3dBE.Domain/Services/**` implement business logic against DAL contracts from `Pluxy3dBE.DalContracts/**`.
  - Repositories: concrete EF repos in `Pluxy3dBE/Repositories/**` and shared repos in `Pluxy3dBE.Repository/**` (where present). DbInitializer lives in `Pluxy3dBE/Data/DbInitializer.cs`.
  - DTOs and service contracts live in `Pluxy3dBE.DomainContracts/**` (e.g. `DTOs/CarritoDto.cs`, `Services/ICarritoService.cs`).
- API surface consumed by the frontend today:
  - Cart: `GET /api/carrito`, `GET /api/carrito/{id}`, `POST /api/carrito`, `PUT /api/carrito/{id}`, `DELETE /api/carrito/{id}`, `DELETE /api/carrito/clear` (see `CartController.cs` + `CarritoService`).
  - Products: `GET /api/productos`, `GET /api/productos/{id}` (see `ProductsController.cs`, `ProductoService`, `Repositories/Product`).

## Dev workflows (commands, ports, env)
- Backend
  - Run: `dotnet run --project Pluxy3dBE/Pluxy3dBE.csproj` (Swagger typically on http://localhost:5299/swagger; health at `/health`).
  - Build task: VS Code task “build Pluxy3dBE” runs `dotnet build Pluxy3dBE/Pluxy3dBE.sln`.
  - DB: defaults to SQLite if no connection string; key is `ConnectionStrings:DefaultConnection` in `Pluxy3dBE/appsettings.json`. On startup: tries `MigrateAsync()` then falls back to `EnsureCreatedAsync()` and runs `DbInitializer.SeedAsync`.
  - DI: prefer adding services in `Extensions/ServiceCollectionExtensions.cs`. Autofac explicit bindings (e.g. Venta/EstadoVenta) are in `Program.cs`.
- Frontend
  - Run: from `pluxy3d/` use `npm i` (or pnpm) then `npm run dev` (Next.js at http://localhost:3000).
  - API base: `NEXT_PUBLIC_API_URL` must point to backend base, e.g. `http://localhost:5299/api` (see `pluxy3d/README_USERS.md`). Some files hardcode `API_URL` in `lib/api.ts` for local dev.
  - Tests: `npm test` uses Jest + jsdom, configs in `jest.config.js` and `jest.setup.js`.
  - Build: `next.config.mjs` ignores TypeScript and ESLint errors during build for DX; production enables chunk splitting and cache headers.

## Project conventions and patterns
- Backend
  - Controllers are thin; delegate to `Pluxy3dBE.Domain.Services/*` interfaces from `Pluxy3dBE.DomainContracts.Services/*`.
  - DTOs live under `Pluxy3dBE.DomainContracts/DTOs/*` and are the public boundary; map with AutoMapper profiles in `Pluxy3dBE.Domain/Mappings/*`.
  - Repositories use EF Core with AsNoTracking on reads, simple pagination and sorting; see `Repositories/Product/EfProductRepository.cs` for examples.
  - Cross-cutting pipeline is centralized: configure CORS, compression, caching, swagger in `Extensions/*` rather than in `Program.cs`.
  - Logging via Serilog; file path configurable by `Logging:FilePath` (see `Program.cs`).
  - Health endpoint `/health` is always mapped.
  - JWT authentication infrastructure exists but not fully applied to controllers.
  - Rate limiting configured for sensitive endpoints (IP-based, 60/min for contact reads, 10/min for writes).
- Frontend
  - Data access through `lib/api.ts` which adds: in-flight request dedupe, 2s AbortController timeout, and a small TTL cache with endpoint-specific fallbacks (carrito/productos → fallback to []). Prefer `apiFetch('/productos?...')` over raw fetch.
  - Cart state via `contexts/CartContext.tsx`: hydrates from localStorage, then syncs with backend in background; exposes `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `refreshCart`, `getTotalItems`, `getTotalPrice`.
  - Next.js config (`next.config.mjs`) ignores TypeScript and ESLint errors during build to prioritize DX; production build enables chunk splitting and cache headers.
  - API calls include retry logic (2 attempts) and network error fallbacks to empty arrays for cart/product endpoints.

## How to add or change features (examples)
- Add a new API endpoint
  1) Define request/response DTOs in `Pluxy3dBE.DomainContracts/DTOs/*`.
  2) Add service contract in `Pluxy3dBE.DomainContracts/Services/*` and implement in `Pluxy3dBE.Domain/Services/*`.
  3) Add repository methods in `Pluxy3dBE.DalContracts/*` and implement in `Pluxy3dBE/Repositories/*` (use `AppDbContextFromDb`).
  4) Register in `Extensions/ServiceCollectionExtensions.cs` (and Autofac in `Program.cs` only if needed).
  5) Create controller in `Pluxy3dBE/Controllers/*` and wire routes under `/api/...`.
- Consume it in the frontend
  - Call via `apiFetch('/mi-endpoint')` and, if stateful, integrate into a context or a server component; follow `CartContext` patterns for optimistic updates and local cache.

## Integration notes and gotchas
- DI errors: if you see “Cannot resolve parameter ... IVentaRepository”, ensure both MS DI and Autofac registrations exist where required (see `Program.cs` custom registrations and `ServiceCollectionExtensions` AddScoped lines).
- Database provider: when `ConnectionStrings:DefaultConnection` looks like `Data Source=...`, the app selects SQLite; otherwise SQL Server (with retry enabled). Keep PendingModelChanges warnings muted via `RelationalEventId.PendingModelChangesWarning` as per current setup.
- Frontend fallbacks: `lib/api.ts` returns empty arrays on timeouts/network errors for `/carrito` and `/productos`. Don’t assume non-empty responses in UI components.
- CORS: Allowed origins come from `Cors:AllowedOrigins` in config; in dev, it falls back to AllowAnyOrigin.

## File signposts
- Backend wiring: `Pluxy3dBE/Program.cs`, `Pluxy3dBE/Extensions/*`, `Pluxy3dBE/Data/DbInitializer.cs`.
- Core contracts: `Pluxy3dBE.DomainContracts/**` (DTOs + Services).
- Repos: `Pluxy3dBE/Repositories/**` and `Pluxy3dBE.Repository/**` (shared DAL); DbContext in `Repository/Data/AppDbContextFromDb.cs`.
- Frontend data + state: `pluxy3d/lib/api.ts`, `pluxy3d/contexts/CartContext.tsx`.
- Build configs: `pluxy3d/next.config.mjs` (ignores errors in dev), `Pluxy3dBE/appsettings.json`.

## Run locally (happy path)
1) Backend: `dotnet run --project Pluxy3dBE/Pluxy3dBE.csproj` → Swagger at http://localhost:5299/swagger
2) Frontend: in `pluxy3d/`, set `NEXT_PUBLIC_API_URL=http://localhost:5299/api` and run `npm run dev` → http://localhost:3000

---

Questions for maintainers
- Do we prefer Autofac-only registrations for all repos/services or keep the mixed MS DI + Autofac style? The current docs and code show both.
- Should `pluxy3d/lib/api.ts` read `NEXT_PUBLIC_API_URL` instead of a hardcoded localhost value for better env parity?
- Any additional test commands or CI steps we should document (e.g., dotnet test filters, coverage, or Next.js test watch patterns)?

## Development rules (from guidelines)
- Mandatory data flow: Frontend → Controller → Service → Repository → Database (and back).
- When adding a feature, build the full chain end-to-end:
  - Frontend: page/component plus API call via `apiFetch(...)`.
  - Backend: DTOs (`DomainContracts/DTOs`), service contract + implementation, repository interface + EF implementation, controller route.
  - Add/adjust AutoMapper profiles under `Domain/Mappings` and Entities only if required.
- No mocks in production code. Use real DB. If missing data, seed records (see `Data/DbInitializer.cs`).
- Responsibility boundaries:
  - Controllers: pass-through only; no business rules.
  - Services: orchestrate and apply business rules.
  - Repositories: persistence only; prefer `AsNoTracking` for reads.
- Pattern guidance:
  - Prefer Strategy/Factory over long if/switch branches.
  - Repository is standard; introduce Unit of Work and/or CQRS for complex scenarios when justified.
- DTO hygiene:
  - Controller ↔ Service must use DTOs only; never expose Entities.
  - Map via AutoMapper profiles in `Pluxy3dBE.Domain/Mappings/*`.
- Pre-PR checklist: Clean Architecture respected; end-to-end path complete; real data paths; minimal branching; SOLID; works locally (backend + frontend).
- Frontend env: Prefer `NEXT_PUBLIC_API_URL` for API base; avoid new hardcoded URLs in `lib/api.ts` (currently hardcoded for local dev only).
