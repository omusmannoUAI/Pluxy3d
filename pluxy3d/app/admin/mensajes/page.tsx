"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useMensajes } from "@/hooks/useMensajes"

export default function AdminMensajesPage() {
  const {
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
  } = useMensajes()

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
