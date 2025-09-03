# Feature implementation template (Pluxy3D)

Use this checklist to add a new end-to-end feature following the project rules.

## Backend (Clean chain)
- [ ] DTOs: Define request/response in `Pluxy3dBE.DomainContracts/DTOs/*`
- [ ] Service contract: Add to `Pluxy3dBE.DomainContracts/Services/*`
- [ ] Service impl: Implement in `Pluxy3dBE.Domain/Services/*`
- [ ] Repo contract: Add to `Pluxy3dBE.DalContracts/*`
- [ ] Repo impl (EF Core): Implement in `Pluxy3dBE/Repositories/*` using `Repository/Data/AppDbContextFromDb.cs`
- [ ] AutoMapper: Map in `Pluxy3dBE.Domain/Mappings/*`
- [ ] Controller: Add endpoint in `Pluxy3dBE/Controllers/*`
- [ ] DI: Register in `Pluxy3dBE/Extensions/ServiceCollectionExtensions.cs` (Autofac bindings in `Program.cs` if needed)

## Frontend
- [ ] Data call: Use `pluxy3d/lib/api.ts` (apiFetch)
- [ ] UI: Page/component to consume the API
- [ ] State: Integrate with an existing context or create a local state pattern similar to `CartContext`
- [ ] Avoid new hardcoded URLs; use `NEXT_PUBLIC_API_URL`

## Local run
- Backend: `dotnet run --project Pluxy3dBE/Pluxy3dBE.csproj`
- Frontend: `cd pluxy3d && npm i && npm run dev` (ensure `NEXT_PUBLIC_API_URL=http://localhost:5299/api`)

## Example snippets

Controller (pass-through)
```csharp
[HttpGet]
public async Task<IActionResult> Get([FromQuery] MyQueryDto query)
  => Ok(await _service.SearchAsync(query));
```

Service (business rules)
```csharp
public async Task<PagedResult<MyDto>> SearchAsync(MyQueryDto query)
{
    var result = await _repo.SearchAsync(query.Term, query.Page, query.PageSize);
    return _mapper.Map<PagedResult<MyDto>>(result);
}
```

Repository (EF Core, AsNoTracking)
```csharp
public async Task<(IEnumerable<MyEntity> Items, int Total)> SearchAsync(string? term, int page, int size)
{
    var q = _db.MyEntities.AsNoTracking();
    if (!string.IsNullOrWhiteSpace(term)) q = q.Where(x => x.Name.Contains(term));
    var total = await q.CountAsync();
    var items = await q.OrderBy(x => x.Id).Skip((page-1)*size).Take(size).ToListAsync();
    return (items, total);
}
```

Frontend
```ts
import { apiFetch } from '@/lib/api'

export async function getData() {
  return apiFetch(`/my-entity?page=1&pageSize=20`)
}
```

Notes
- No mocks in production; seed real DB if needed (`Pluxy3dBE/Data/DbInitializer.cs`).
- Prefer Strategy/Factory patterns over large if/switch.
- Keep controllers thin; only DTOs across boundaries.
