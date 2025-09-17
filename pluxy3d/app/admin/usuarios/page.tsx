"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Eye, 
  Trash2,
  Phone,
  Mail,
  Filter,
  Download
} from "lucide-react"
import { apiFetch } from "@/lib/api"
import { cn } from "@/lib/utils"

type User = {
  id: number
  name: string
  email: string
  phone?: string
  since: string
  lastAccess?: string
  status: "Activo" | "Inactivo"
  role: "Cliente" | "Admin" | "Staff"
  orders: number
  spent: string
}

function mapApiToUser(raw: any): User {
  return {
    id: raw.id || Math.random(),
    name: raw.Nombre || raw.name || raw.fullName || "Usuario",
    email: raw.Email || raw.email || "",
    phone: raw.Telefono || raw.phone,
    since: raw.Since || raw.miembroDesde || raw.createdAt || "",
    lastAccess: raw.UltimoAcceso || raw.lastAccess || undefined,
    status: (raw.Activo ?? true) ? "Activo" : "Inactivo",
    role: (raw.Rol || raw.role || "customer") === "admin" ? "Admin" : (raw.Rol || raw.role) === "staff" ? "Staff" : "Cliente",
    orders: typeof raw.Pedidos === "number" ? raw.Pedidos : 0,
    spent: typeof raw.TotalGastado === "string" || typeof raw.TotalGastado === "number" ? String(raw.TotalGastado) : "—",
  } as User
}

export default function AdminUsuariosPage() {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("Todos los estados")
  const [roleFilter, setRoleFilter] = useState<string>("Todos los roles")
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])

  async function loadUsers() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      const data = await apiFetch(`/usuarios?${params.toString()}`)
      const list = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : [])
      const mapped = list.map(mapApiToUser)
      setUsers(mapped)
    } catch (e: any) {
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
      const matchesStatus = statusFilter === "Todos los estados" || u.status === statusFilter
      const matchesRole = roleFilter === "Todos los roles" || u.role === roleFilter
      return matchesQuery && matchesStatus && matchesRole
    })
  }, [users, query, statusFilter, roleFilter])

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Administra los usuarios registrados en la plataforma
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar usuarios..."
                className="pl-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos los estados">Todos los estados</SelectItem>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos los roles">Todos los roles</SelectItem>
                <SelectItem value="Cliente">Cliente</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex-shrink-0">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users list */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Cargando usuarios...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron usuarios
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map((user) => (
                <div key={user.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {user.name
                            .split(" ")
                            .map((n) => n.charAt(0))
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </h3>
                          <Badge 
                            variant={user.status === "Activo" ? "default" : "secondary"}
                            className={cn(
                              user.status === "Activo" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                            )}
                          >
                            {user.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                        
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-1 text-xs text-gray-400">
                          Tel: +54 11 9945-5678 | Miembro desde: {user.since || "2023-06-15"} | 
                          Último acceso: {user.lastAccess || "2024-01-25"}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.orders} pedidos
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.spent}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
