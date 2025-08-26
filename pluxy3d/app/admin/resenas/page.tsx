"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Estado = "Pendiente" | "Aprobada" | "Rechazada"
type Review = {
  id: string
  producto: string
  estrellas: number
  autor: string
  email: string
  fecha: string // ISO or YYYY-MM-DD
  texto: string
  util: number
  estado: Estado
}

const seed: Review[] = [
  { id: "1", producto: "Creality Ender 3 V2", estrellas: 5, autor: "Juan Pérez", email: "juan@example.com", fecha: "2024-01-25", texto: "Excelente producto, muy buena calidad y llegó rápido.", util: 12, estado: "Aprobada" },
  { id: "2", producto: "Kit Mejora Ender-3", estrellas: 3, autor: "María García", email: "maria@example.com", fecha: "2024-01-24", texto: "Muy bueno, aunque la instalación fue un poco complicada.", util: 5, estado: "Pendiente" },
  { id: "3", producto: "Hellbot Magna 2", estrellas: 2, autor: "Carlos López", email: "carlos@example.com", fecha: "2024-01-23", texto: "No funcionó como esperaba, tuve varios problemas.", util: 1, estado: "Pendiente" },
]

const Stars = React.memo(function Stars({ value }: { value: number }) {
  const full = Math.max(0, Math.min(5, value))
  return <span className="text-amber-500 select-none">{"★".repeat(full)}{"☆".repeat(5 - full)}</span>
})

const ReviewRow = React.memo(function ReviewRow({ r, selected, onToggle, onApprove, onReject, onDelete }: { r: Review; selected: boolean; onToggle: (id: string, checked: boolean) => void; onApprove: (id: string) => void; onReject: (id: string) => void; onDelete: (id: string) => void }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Checkbox checked={selected} onCheckedChange={(c) => onToggle(r.id, Boolean(c))} aria-label="Seleccionar reseña" />
          <div className="font-medium flex items-center gap-2">
            <span>{r.producto}</span>
            <Stars value={r.estrellas} />
          </div>
        </div>
        <Badge variant="secondary" className={r.estado === "Aprobada" ? "bg-emerald-100 text-emerald-700" : r.estado === "Rechazada" ? "bg-rose-100 text-rose-700" : "bg-muted"}>
          {r.estado}
        </Badge>
      </div>
      <div className="text-sm text-muted-foreground">Por {r.autor} ({r.email})</div>
      <p className="text-sm mt-2">{r.texto}</p>
      <div className="text-xs text-muted-foreground mt-2 flex flex-wrap items-center justify-between gap-2">
        <span>
          {r.fecha}  {r.util} personas encontraron esto útil
        </span>
        <div className="flex items-center gap-2">
          {r.estado !== "Aprobada" && (
            <button className="rounded border px-2 py-1 text-xs hover:bg-emerald-50" onClick={() => onApprove(r.id)}>
              Aprobar
            </button>
          )}
          {r.estado !== "Rechazada" && (
            <button className="rounded border px-2 py-1 text-xs hover:bg-rose-50" onClick={() => onReject(r.id)}>
              Rechazar
            </button>
          )}
          <button className="rounded border px-2 py-1 text-xs hover:bg-muted" onClick={() => onDelete(r.id)}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
})

export default function AdminResenasPage() {
  const [items, setItems] = React.useState<Review[]>(seed)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  // Filters
  const [q, setQ] = React.useState("")
  const [estado, setEstado] = React.useState<"Todos" | Estado>("Todos")
  const [minStars, setMinStars] = React.useState(0)

  // Pagination
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const filtered = React.useMemo(() => {
    const lower = q.trim().toLowerCase()
    return items
      .filter((r) => (estado === "Todos" ? true : r.estado === estado))
      .filter((r) => (minStars > 0 ? r.estrellas >= minStars : true))
      .filter((r) => (lower ? r.producto.toLowerCase().includes(lower) || r.autor.toLowerCase().includes(lower) || r.email.toLowerCase().includes(lower) : true))
      .slice()
      .sort((a, b) => (a.fecha > b.fecha ? -1 : 1))
  }, [items, q, estado, minStars])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageClamped = Math.min(page, totalPages)
  const pageItems = React.useMemo(() => {
    const start = (pageClamped - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, pageClamped, pageSize])

  // Actions
  const approve = (id: string) => setItems((arr) => arr.map((r) => (r.id === id ? { ...r, estado: "Aprobada" } : r)))
  const reject = (id: string) => setItems((arr) => arr.map((r) => (r.id === id ? { ...r, estado: "Rechazada" } : r)))
  const remove = (id: string) => setItems((arr) => arr.filter((r) => r.id !== id))

  // Selection handlers
  const toggleOne = React.useCallback((id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const pageIds = React.useMemo(() => pageItems.map((r) => r.id), [pageItems])
  const selectedOnPageCount = pageIds.filter((id) => selected.has(id)).length
  const allOnPageSelected = selectedOnPageCount === pageIds.length && pageIds.length > 0
  const noneOnPageSelected = selectedOnPageCount === 0
  const masterChecked: boolean | "indeterminate" = allOnPageSelected ? true : noneOnPageSelected ? false : "indeterminate"

  const togglePageAll = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) pageIds.forEach((id) => next.add(id))
      else pageIds.forEach((id) => next.delete(id))
      return next
    })
  }

  const clearSelection = () => setSelected(new Set())

  const approveSelected = () => {
    if (selected.size === 0) return
    setItems((arr) => arr.map((r) => (selected.has(r.id) ? { ...r, estado: "Aprobada" } : r)))
    clearSelection()
  }

  const rejectSelected = () => {
    if (selected.size === 0) return
    setItems((arr) => arr.map((r) => (selected.has(r.id) ? { ...r, estado: "Rechazada" } : r)))
    clearSelection()
  }

  const deleteSelected = () => {
    if (selected.size === 0) return
    setItems((arr) => arr.filter((r) => !selected.has(r.id)))
    setConfirmOpen(false)
    clearSelection()
  }

  // Reset page on filters
  React.useEffect(() => {
    setPage(1)
    clearSelection()
  }, [q, estado, minStars, pageSize])

  const pendingCount = items.filter((r) => r.estado === "Pendiente").length
  const approvedCount = items.filter((r) => r.estado === "Aprobada").length

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Gestión de Reseñas</h2>
      <Card>
        <CardHeader>
          <CardTitle>Modera las reseñas de productos</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Bulk actions / selection */}
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox checked={masterChecked} onCheckedChange={(c) => togglePageAll(Boolean(c))} aria-label="Seleccionar página" />
              <span className="text-muted-foreground">Seleccionar página ({selectedOnPageCount}/{pageIds.length})</span>
              {selected.size > 0 && (
                <button className="rounded border px-2 py-1" onClick={clearSelection}>
                  Limpiar selección ({selected.size})
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded border px-2 py-1 disabled:opacity-50" disabled={selected.size === 0} onClick={approveSelected}>
                Aprobar seleccionadas
              </button>
              <button className="rounded border px-2 py-1 disabled:opacity-50" disabled={selected.size === 0} onClick={rejectSelected}>
                Rechazar seleccionadas
              </button>
              <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <button className="rounded border px-2 py-1 disabled:opacity-50" disabled={selected.size === 0} onClick={() => setConfirmOpen(true)}>
                  Eliminar seleccionadas
                </button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar reseñas</AlertDialogTitle>
                    <AlertDialogDescription>
                      Vas a eliminar {selected.size} reseña(s). Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteSelected}>Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-4">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por producto, autor o email"
              className="h-9 rounded-md border px-3 text-sm"
            />
            <select value={estado} onChange={(e) => setEstado(e.target.value as any)} className="h-9 rounded-md border px-2 text-sm">
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Rechazada">Rechazada</option>
            </select>
            <select value={minStars} onChange={(e) => setMinStars(Number(e.target.value))} className="h-9 rounded-md border px-2 text-sm">
              <option value={0}>Todas las calificaciones</option>
              <option value={5}>5 estrellas</option>
              <option value={4}>4+ estrellas</option>
              <option value={3}>3+ estrellas</option>
              <option value={2}>2+ estrellas</option>
              <option value={1}>1+ estrella</option>
            </select>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">Pendientes: {pendingCount}</Badge>
              <Badge variant="secondary">Aprobadas: {approvedCount}</Badge>
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {pageItems.length === 0 && <div className="text-sm text-muted-foreground">No hay reseñas con los filtros aplicados.</div>}
            {pageItems.map((r) => (
              <ReviewRow key={r.id} r={r} selected={selected.has(r.id)} onToggle={toggleOne} onApprove={approve} onReject={reject} onDelete={remove} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <button
                className="rounded border px-2 py-1 disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageClamped <= 1}
              >
                ← Anterior
              </button>
              <span>
                Página {pageClamped} de {totalPages}
              </span>
              <button
                className="rounded border px-2 py-1 disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageClamped >= totalPages}
              >
                Siguiente →
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Por página</span>
              <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="h-9 rounded-md border px-2">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-muted-foreground">Total: {filtered.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
