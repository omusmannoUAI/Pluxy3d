import Link from "next/link"

type CatKey = "impresoras" | "componentes" | "filamentos" | "accesorios"

const baseCats: Array<{ key: CatKey; href: string; title: string; desc: string }> = [
  { key: "impresoras", href: "/productos/impresoras", title: "Impresoras 3D", desc: "Desde principiantes hasta profesionales" },
  { key: "componentes", href: "/productos/componentes", title: "Componentes", desc: "Repuestos y mejoras para tu impresora" },
  { key: "filamentos", href: "/productos/filamentos", title: "Filamentos", desc: "Materiales de alta calidad" },
  { key: "accesorios", href: "/productos/accesorios", title: "Accesorios", desc: "Todo lo que necesitas para imprimir" },
]

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV !== 'production' ? 'http://localhost:5299/api' : '/api')

export default async function CategoriesGrid() {
  const counts: Record<CatKey, number | null> = { impresoras: null, componentes: null, filamentos: null, accesorios: null }
  try {
    const catsRes = await fetch(`${API_BASE}/categorias`, { next: { revalidate: 300 } })
    const cats = await catsRes.json().catch(() => null)
    if (Array.isArray(cats)) {
      for (const c of cats) {
        const name = norm(String(c.name ?? c.label ?? ""))
        const count = Number(c.count ?? 0)
        if (name.includes("impresora")) counts.impresoras = count
        else if (name.includes("componente") || name.includes("repuesto")) counts.componentes = count
        else if (name.includes("filamento")) counts.filamentos = count
        else if (name.includes("accesorio")) counts.accesorios = count
      }
    }

    if (Object.values(counts).some(v => v === null)) {
      const prodsRes = await fetch(`${API_BASE}/productos`, { next: { revalidate: 300 } })
      const prods = await prodsRes.json().catch(() => null)
      if (Array.isArray(prods)) {
        const agg: Record<CatKey, number> = { impresoras: 0, componentes: 0, filamentos: 0, accesorios: 0 }
        for (const p of prods) {
          const cat = norm(String(p.category ?? p.categoria ?? ""))
          if (cat.includes("impresora")) agg.impresoras++
          else if (cat.includes("componente") || cat.includes("repuesto") || cat.includes("mejora")) agg.componentes++
          else if (cat.includes("filamento")) agg.filamentos++
          else if (cat.includes("accesorio")) agg.accesorios++
        }
        for (const key of Object.keys(counts) as CatKey[]) {
          if (counts[key] == null) counts[key] = agg[key]
        }
      }
    }
  } catch (err) {
    // keep nulls - UI will show placeholders
  }

  const items = baseCats.map(c => ({ ...c, count: counts[c.key] }))

  return (
    <section className="container mx-auto w-full py-10 md:py-12">
      <div className="text-center mb-8 md:mb-10">
        <h2 className="text-3xl font-bold">Explora por Categor\u00edas</h2>
        <p className="text-muted-foreground mt-2">Encuentra exactamente lo que necesitas navegando por nuestras categor\u00edas especializadas</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((c) => (
          <Link key={c.title} href={c.href} className="rounded-lg overflow-hidden border bg-card hover:shadow-md transition-shadow">
            <div className="w-full h-36 bg-muted" aria-label={c.title} />
            <div className="p-4">
              <div className="font-semibold">{c.title}</div>
              <div className="text-xs text-muted-foreground">
                {c.count == null ? (
                  <span className="inline-block h-3 w-16 rounded bg-muted animate-pulse align-middle" aria-label="Cargando" />
                ) : (
                  <>{c.count} productos</>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-2">{c.desc}</div>
            </div>
          </Link>
        ))}
      </div>
  </section>
  )
}
