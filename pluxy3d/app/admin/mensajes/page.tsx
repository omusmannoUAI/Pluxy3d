"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Mensaje {
  id: number
  nombre: string
  email: string
  mensaje: string
  createdAt: string
  read?: boolean
}

export default function AdminMensajesPage() {
  const { toast } = useToast()
  const [data, setData] = useState<Mensaje[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState("")
  const [selected, setSelected] = useState<Set<number>>(new Set())

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/contacto", { cache: "no-store" })
        if (!res.ok) throw new Error("No se pudo cargar")
        const arr = (await res.json()) as Mensaje[]
        if (alive) setData(arr.sort((a,b)=>a.createdAt.localeCompare(b.createdAt)).reverse())
      } catch (e: any) {
        toast({ title: "Error", description: e?.message || "No se pudieron cargar los mensajes", variant: "destructive" })
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [toast])

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return data
    return data.filter(m =>
      m.nombre.toLowerCase().includes(t) ||
      m.email.toLowerCase().includes(t) ||
      m.mensaje.toLowerCase().includes(t)
    )
  }, [q, data])

  const toggleSelect = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const toggleSelectAllFiltered = () => {
    setSelected(prev => {
      const filteredIds = new Set(filtered.map(m => m.id))
      const allSelected = filtered.every(m => prev.has(m.id))
      if (allSelected) {
        const next = new Set(prev)
        for (const id of filteredIds) next.delete(id)
        return next
      } else {
        const next = new Set(prev)
        for (const id of filteredIds) next.add(id)
        return next
      }
    })
  }

  const clearSelection = () => setSelected(new Set())

  const toggleRead = async (m: Mensaje, value: boolean) => {
    const prev = data
    setData(d => d.map(x => x.id === m.id ? { ...x, read: value } : x))
    try {
      const res = await fetch('/api/contacto', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: m.id, read: value })
      })
      if (!res.ok) throw new Error('No se pudo actualizar')
    } catch (e: any) {
      setData(prev)
      toast({ title: 'Error', description: e?.message || 'No se pudo actualizar', variant: 'destructive' })
    }
  }

  const remove = async (m: Mensaje) => {
    const prev = data
    setData(d => d.filter(x => x.id !== m.id))
    try {
      const res = await fetch(`/api/contacto?id=${m.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('No se pudo eliminar')
    } catch (e: any) {
      setData(prev)
      toast({ title: 'Error', description: e?.message || 'No se pudo eliminar', variant: 'destructive' })
    }
  }

  const exportCsv = () => {
    const cols = ["id","nombre","email","mensaje","createdAt"]
    const esc = (s: string) => '"' + s.replace(/"/g, '""').replace(/\n/g, ' ') + '"'
    const lines = [cols.join(",")]
    for (const r of filtered) {
      lines.push([
        r.id,
        esc(r.nombre || ""),
        esc(r.email || ""),
        esc(r.mensaje || ""),
        esc(r.createdAt || ""),
      ].join(","))
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const date = new Date().toISOString().slice(0,19).replaceAll(":","-")
    a.download = `mensajes-contacto-${date}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const bulkPatchRead = async (value: boolean) => {
    if (selected.size === 0) return
    const ids = Array.from(selected)
    // Optimistic update
    setData(d => d.map(x => ids.includes(x.id) ? { ...x, read: value } : x))
    try {
      const results = await Promise.all(ids.map(id => fetch('/api/contacto', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: value })
      })))
      const failed = results.filter(r => !r.ok).length
      if (failed) throw new Error(`${failed} actualizaciones fallaron`)
      toast({ title: value ? 'Marcados como leídos' : 'Marcados como no leídos', description: `${ids.length} mensaje(s)` })
    } catch (e: any) {
      // Reload to recover
      setLoading(true)
      fetch('/api/contacto', { cache: 'no-store' }).then(r => r.json()).then((arr: Mensaje[]) => setData(arr)).finally(() => setLoading(false))
      toast({ title: 'Error', description: e?.message || 'No se pudo completar la acción', variant: 'destructive' })
    } finally {
      clearSelection()
    }
  }

  const bulkDelete = async () => {
    if (selected.size === 0) return
    const count = selected.size
    const proceed = typeof window !== 'undefined' ? window.confirm(`¿Eliminar ${count} mensaje(s)? Esta acción no se puede deshacer.`) : true
    if (!proceed) return
    const ids = Array.from(selected)
    // Optimistic update
    setData(d => d.filter(x => !ids.includes(x.id)))
    try {
      const results = await Promise.all(ids.map(id => fetch(`/api/contacto?id=${id}` , { method: 'DELETE' })))
      const failed = results.filter(r => !r.ok).length
      if (failed) throw new Error(`${failed} eliminaciones fallaron`)
      toast({ title: 'Eliminados', description: `${count} mensaje(s)` })
    } catch (e: any) {
      // Reload to recover
      setLoading(true)
      fetch('/api/contacto', { cache: 'no-store' }).then(r => r.json()).then((arr: Mensaje[]) => setData(arr)).finally(() => setLoading(false))
      toast({ title: 'Error', description: e?.message || 'No se pudo eliminar', variant: 'destructive' })
    } finally {
      clearSelection()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h2 className="text-xl font-semibold">Mensajes de Contacto</h2>
        <div className="flex items-center gap-2">
          <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Buscar por nombre, email o texto" className="w-64" />
          <Button onClick={exportCsv} variant="outline">Exportar CSV</Button>
        </div>
      </div>
      {selected.size > 0 && (
        <div className="flex items-center gap-2 bg-muted/40 border rounded-md p-2 text-sm">
          <div className="font-medium">{selected.size} seleccionados</div>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => bulkPatchRead(true)}>Marcar leído</Button>
            <Button size="sm" variant="outline" onClick={() => bulkPatchRead(false)}>Marcar no leído</Button>
            <Button size="sm" variant="destructive" onClick={bulkDelete}>Eliminar</Button>
            <Button size="sm" variant="ghost" onClick={clearSelection}>Cancelar</Button>
          </div>
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span>Entradas recibidas</span>
            <Badge variant="secondary">{loading ? '...' : filtered.length}</Badge>
            <Button size="sm" variant="ghost" onClick={toggleSelectAllFiltered} disabled={loading || filtered.length === 0}>
              {filtered.length > 0 && filtered.every(m => selected.has(m.id)) ? 'Quitar selección' : 'Seleccionar visibles'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Cargando mensajes…</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No hay mensajes.</div>
          ) : (
            <div className="divide-y">
              {filtered.map(m => (
                <details key={m.id} className="py-3 group">
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium flex items-center gap-2">
                        <input type="checkbox" checked={selected.has(m.id)} onChange={() => toggleSelect(m.id)} aria-label="Seleccionar" />
                        {!m.read && <span className="inline-block h-2 w-2 rounded-full bg-purple-500" aria-label="no leído" />}
                        {m.nombre} <span className="text-muted-foreground">&lt;{m.email}&gt;</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</div>
                        <Button size="sm" variant={m.read ? 'outline' : 'secondary'} onClick={(e) => { e.preventDefault(); toggleRead(m, !m.read) }}>
                          {m.read ? 'Marcar no leído' : 'Marcar leído'}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={(e) => { e.preventDefault(); if (window.confirm('¿Eliminar este mensaje?')) remove(m) }}>Eliminar</Button>
                      </div>
                    </div>
                  </summary>
                  <div className="mt-2">
                    <Textarea readOnly value={m.mensaje} className="min-h-[100px]" />
                  </div>
                </details>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
