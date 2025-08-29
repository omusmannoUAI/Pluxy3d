"use client"

import { useEffect, useMemo, useState } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Mensaje {
  id: number
  nombre: string
  email: string
  mensaje: string
  createdAt: string
  read?: boolean
}

export function useMensajes() {
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
      toast({ title: 'Error', description: e?.message || 'No se pudo actualizar', variant: "destructive" })
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
      toast({ title: 'Error', description: e?.message || 'No se pudo eliminar', variant: "destructive" })
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
      toast({ title: 'Error', description: e?.message || 'No se pudo completar la acción', variant: "destructive" })
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
      toast({ title: 'Error', description: e?.message || 'No se pudo eliminar', variant: "destructive" })
    } finally {
      clearSelection()
    }
  }

  return {
    data,
    loading,
    q,
    setQ,
    selected,
    filtered,
    toggleSelect,
    toggleSelectAllFiltered,
    clearSelection,
    toggleRead,
    remove,
    exportCsv,
    bulkPatchRead,
    bulkDelete
  }
}
