"use client"

import { useEffect, useState } from "react"
import { 
  Search, 
  Download, 
  RefreshCw, 
  User, 
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Mail,
  Trophy,
  Medal,
  Award,
  Star,
  ArrowUpDown,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getUsers, getUserById } from "@/services/api"

// Definición de Rangos de Usuario
const USER_RANKS = [
  { name: "Platino", minSpent: 10000000, color: "bg-slate-900 text-slate-100 border-slate-700", icon: Trophy },
  { name: "Oro", minSpent: 1000000, color: "bg-amber-100 text-amber-800 border-amber-200", icon: Medal },
  { name: "Plata", minSpent: 100000, color: "bg-slate-100 text-slate-700 border-slate-200", icon: Award },
  { name: "Bronce", minSpent: 0, color: "bg-orange-50 text-orange-700 border-orange-100", icon: Star },
]

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'totalSpent', direction: 'desc' })
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterAndSortUsers()
  }, [users, searchTerm, roleFilter, sortConfig])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortUsers = () => {
    let result = [...users]

    // Filtrado
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase()
      result = result.filter(u => 
        (u.nombre?.toLowerCase() || "").includes(lowerTerm) ||
        (u.apellido?.toLowerCase() || "").includes(lowerTerm) ||
        (u.email?.toLowerCase() || "").includes(lowerTerm)
      )
    }

    if (roleFilter !== "all") {
      result = result.filter(u => {
        const roles = u.roles || []
        if (roleFilter === "admin") return roles.includes("Admin")
        if (roleFilter === "customer") return !roles.includes("Admin")
        return true
      })
    }

    // Ordenamiento
    result.sort((a, b) => {
      const aValue = a[sortConfig.key] ?? 0
      const bValue = b[sortConfig.key] ?? 0
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })

    setFilteredUsers(result)
  }

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }))
  }

  const handleViewUser = async (user: any) => {
    try {
      // Intentar cargar detalles completos si es necesario
      const fullUser = await getUserById(user.id)
      setSelectedUser(fullUser || user)
    } catch (e) {
      console.error("Error loading user details", e)
      setSelectedUser(user)
    }
    setIsSheetOpen(true)
  }

  const getUserRank = (totalSpent: number) => {
    return USER_RANKS.find(r => totalSpent >= r.minSpent) || USER_RANKS[USER_RANKS.length - 1]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Usuarios</h1>
          <p className="text-muted-foreground">Gestión de clientes, administradores y sus niveles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={loadUsers} className="bg-white">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button className="bg-slate-900 text-white hover:bg-slate-800">
            <User className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios VIP (Platino)</CardTitle>
            <Trophy className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => (u.totalSpent || 0) >= 10000000).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos este mes</CardTitle>
            <User className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => {
                if (!u.fechaRegistro) return false
                const date = new Date(u.fechaRegistro)
                const now = new Date()
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre o email..." 
                className="pl-8 bg-slate-50 border-slate-200" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="customer">Clientes</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2 bg-white">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[300px]">Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead className="cursor-pointer hover:text-slate-900" onClick={() => handleSort('totalOrders')}>
                  <div className="flex items-center gap-1">
                    Pedidos
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:text-slate-900" onClick={() => handleSort('totalSpent')}>
                  <div className="flex items-center gap-1">
                    Total Gastado
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Cargando usuarios...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const rank = getUserRank(user.totalSpent || 0)
                  const RankIcon = rank.icon
                  const isAdmin = user.roles?.includes("Admin")

                  return (
                    <TableRow key={user.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => handleViewUser(user)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-slate-200">
                            <AvatarImage src={user.image} />
                            <AvatarFallback className="bg-slate-100 text-slate-600 font-medium">
                              {user.nombre?.substring(0, 1).toUpperCase()}{user.apellido?.substring(0, 1).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">
                              {user.nombre} {user.apellido}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isAdmin ? (
                          <Badge variant="default" className="bg-slate-900 hover:bg-slate-800 flex w-fit items-center gap-1">
                            <Shield className="h-3 w-3" /> Admin
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                            Cliente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-700">
                          {user.totalOrders || 0} órdenes
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-slate-900">
                          {formatCurrency(user.totalSpent)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${rank.color} flex items-center gap-1.5 w-fit px-2.5 py-0.5`}>
                          <RankIcon className="h-3.5 w-3.5" />
                          {rank.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${user.activo ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                          <span className="text-sm text-slate-600">{user.activo ? 'Activo' : 'Inactivo'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewUser(user); }}>
                              <User className="mr-2 h-4 w-4" /> Ver Perfil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Mail className="mr-2 h-4 w-4" /> Enviar Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>
                              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6 pb-4 border-b">
            <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-base px-3 py-1 bg-slate-100">
                    ID: {selectedUser?.id?.substring(0, 8)}...
                </Badge>
                {selectedUser && (
                    <Badge variant={selectedUser.activo ? "default" : "secondary"} className={selectedUser.activo ? "bg-emerald-500 hover:bg-emerald-600" : "bg-slate-200 text-slate-600"}>
                        {selectedUser.activo ? "Activo" : "Inactivo"}
                    </Badge>
                )}
            </div>
            <SheetTitle className="text-xl">Perfil de Usuario</SheetTitle>
            <SheetDescription>
              Información detallada y gestión de cuenta.
            </SheetDescription>
          </SheetHeader>

          {selectedUser && (
            <div className="space-y-8">
              {/* Header Profile */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                    <AvatarImage src={selectedUser.image} />
                    <AvatarFallback className="bg-slate-200 text-slate-600 text-xl font-bold">
                        {selectedUser.nombre?.substring(0, 1).toUpperCase()}{selectedUser.apellido?.substring(0, 1).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedUser.nombre} {selectedUser.apellido}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {selectedUser.email}
                    </p>
                    <div className="flex gap-2 mt-2">
                        {selectedUser.roles?.map((role: string) => (
                            <Badge key={role} variant="secondary" className="text-xs bg-white border border-slate-200">
                                {role}
                            </Badge>
                        ))}
                    </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-xl bg-white shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Gastado</p>
                    <p className="text-2xl font-bold text-slate-900">{formatCurrency(selectedUser.totalSpent)}</p>
                    <div className="mt-2">
                        {(() => {
                            const rank = getUserRank(selectedUser.totalSpent || 0)
                            const RankIcon = rank.icon
                            return (
                                <Badge variant="outline" className={`${rank.color} flex items-center gap-1.5 w-fit px-2 py-0.5`}>
                                    <RankIcon className="h-3 w-3" /> {rank.name}
                                </Badge>
                            )
                        })()}
                    </div>
                </div>
                <div className="p-4 border rounded-xl bg-white shadow-sm">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Pedidos</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedUser.totalOrders || 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">Órdenes completadas</p>
                </div>
              </div>

              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                  <User className="h-5 w-5 text-slate-500" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 gap-y-4 text-sm p-4 border rounded-xl bg-white shadow-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Nombre</p>
                        <p className="font-medium text-slate-900">{selectedUser.nombre}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground mb-1">Apellido</p>
                        <p className="font-medium text-slate-900">{selectedUser.apellido}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="font-medium text-slate-900">{selectedUser.email}</p>
                  </div>
                  {selectedUser.telefono && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Teléfono</p>
                        <p className="font-medium text-slate-900">{selectedUser.telefono}</p>
                      </div>
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Fecha de Registro</p>
                    <p className="font-medium text-slate-900">
                        {selectedUser.fechaRegistro ? new Date(selectedUser.fechaRegistro).toLocaleDateString() : "No disponible"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                  <Shield className="h-5 w-5 text-slate-500" />
                  Acciones de Cuenta
                </h3>
                <div className="flex flex-col gap-3">
                    <Button variant="outline" className="justify-start h-11 bg-white hover:bg-slate-50">
                        <Mail className="mr-2 h-4 w-4" /> Enviar Correo de Recuperación
                    </Button>
                    <Button variant="outline" className="justify-start h-11 bg-white hover:bg-slate-50 text-red-600 hover:text-red-700 hover:border-red-200">
                        <Trash2 className="mr-2 h-4 w-4" /> Desactivar Cuenta
                    </Button>
                </div>
              </div>

            </div>
          )}
          
          <SheetFooter className="mt-8 pt-4 border-t">
            <SheetClose asChild>
              <Button variant="outline" className="w-full h-11 text-base">Cerrar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
