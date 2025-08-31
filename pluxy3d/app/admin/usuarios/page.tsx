"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, RefreshCcw, Search, Pencil, Eye, Shield, Trash2 } from "lucide-react"
import { apiFetch } from "@/lib/api"

type User = {
  name: string
  email: string
  since: string
  lastAccess?: string
  status: "Activo" | "Inactivo"
  role: "customer" | "admin" | "staff"
  orders: number
  spent: string
}

// Map mínimo desde la API actual (UsuariosController devuelve mock simple)
function mapApiToUser(raw: any): User {
  return {
    name: raw.Nombre || raw.name || raw.fullName || "Usuario",
    email: raw.Email || raw.email || "",
    since: raw.Since || raw.miembroDesde || raw.createdAt || "",
    lastAccess: raw.UltimoAcceso || raw.lastAccess || undefined,
    status: (raw.Activo ?? true) ? "Activo" : "Inactivo",
    role: (raw.Rol || raw.role || "customer").toLowerCase(),
    orders: typeof raw.Pedidos === "number" ? raw.Pedidos : 0,
    spent: typeof raw.TotalGastado === "string" || typeof raw.TotalGastado === "number" ? String(raw.TotalGastado) : "—",
  } as User
}

export default function AdminUsuariosPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<string>("todos")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])

  async function loadUsers() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (status) params.set('status', status)
      const data = await apiFetch(`/usuarios?${params.toString()}`)
      // El controlador devuelve un envoltorio paginado
      const list = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : [])
      const mapped = list.map(mapApiToUser)
      setUsers(mapped)
    } catch (e: any) {
      setError(e?.message || 'Error al cargar usuarios')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter(u => {
      const matchesQuery = !q || `${u.name} ${u.email}`.toLowerCase().includes(q)
      const matchesStatus = status === "todos" || (status === "activos" ? u.status === "Activo" : u.status === "Inactivo")
      return matchesQuery && matchesStatus
    })
  }, [query, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Gestión de Usuarios</h2>
          <p className="text-sm text-muted-foreground">Administra los usuarios registrados en la plataforma</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
          <RefreshCcw className="h-4 w-4 mr-2" /> Actualizar
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 flex items-center gap-3">
              <div className="relative w-full md:max-w-xl">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuarios..."
                  className="pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Separator orientation="vertical" className="hidden md:block h-6" />
              <div className="flex items-center gap-2">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="activos">Activos</SelectItem>
                    <SelectItem value="inactivos">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const params = new URLSearchParams()
                      if (query) params.set('q', query)
                      if (status) params.set('status', status)
                      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5299/api'}/usuarios/export?${params.toString()}`
                      window.open(url, '_blank')
                    } catch {}
                  }}
                >
                  Exportar
                </Button>
              </div>
            </div>
            <Button size="sm" className="md:ml-4">
              <Plus className="h-4 w-4 mr-2" /> Nuevo Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {error && (
            <div className="text-sm text-red-600 mb-3">{error}</div>
          )}
          {loading && (
            <div className="text-sm text-muted-foreground mb-3">Cargando usuarios…</div>
          )}
          <div className="space-y-3">
            {filtered.map((u) => (
              <div key={u.email} className="rounded-lg border bg-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {u.name
                        .split(" ")
                        .map((p) => p.charAt(0))
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium leading-none">{u.name}</div>
                    <div className="text-sm text-muted-foreground">{u.email}</div>
                    <div className="text-xs text-muted-foreground">Miembro desde: {u.since || '—'} | Último acceso: {u.lastAccess || "—"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={u.status === "Activo" ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}
                  >
                    {u.status}
                  </Badge>
                  <Badge variant="outline">{u.role}</Badge>
                  <div className="text-right text-sm min-w-[110px]">
                    <div className="font-medium">{u.orders ?? 0} pedidos</div>
                    <div className="text-muted-foreground">{u.spent ?? '—'}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" aria-label="Ver">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Permisos">
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Eliminar">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <div className="text-sm text-muted-foreground py-6 text-center">No hay usuarios para mostrar.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
