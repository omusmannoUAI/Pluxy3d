"use client"

import { useEffect, useState } from "react"
import { 
  Search, 
  RefreshCw, 
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MoreHorizontal,
  Filter,
  Calendar,
  User,
  Package,
  CreditCard,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getAllOrders, updateOrderStatus, getOrderById } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { format, addWeeks, isPast, differenceInDays, isSameDay } from "date-fns"
import { es } from "date-fns/locale"

// Definición de estados según base de datos
const ORDER_STATUSES = {
  0: { label: "Pendiente", color: "bg-slate-100 text-slate-800 border-slate-200", icon: Clock },
  1: { label: "Procesando", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: RefreshCw },
  2: { label: "Pagada", color: "bg-blue-100 text-blue-800 border-blue-200", icon: CreditCard },
  3: { label: "Enviada", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Truck },
  4: { label: "Cancelada", color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
  5: { label: "Entregada", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await getAllOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los pedidos",
        variant: "destructive",
      })
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrder = async (order: any) => {
    // Si la orden ya tiene items, la usamos directamente, si no, intentamos cargar detalles
    if (order.items && order.items.length > 0) {
      setSelectedOrder(order)
    } else {
      try {
        const fullOrder = await getOrderById(order.id)
        setSelectedOrder(fullOrder)
      } catch (e) {
        // Fallback si falla el detalle, mostramos lo que tenemos
        setSelectedOrder(order)
      }
    }
    setIsSheetOpen(true)
  }

  const handleStatusChange = async (newStatusId: string) => {
    if (!selectedOrder) return
    
    setUpdatingStatus(true)
    try {
      const statusIdInt = parseInt(newStatusId)
      const success = await updateOrderStatus(selectedOrder.id, statusIdInt)
      
      if (success) {
        toast({
          title: "Estado actualizado",
          description: `El pedido #${selectedOrder.id} ha cambiado a ${ORDER_STATUSES[statusIdInt as keyof typeof ORDER_STATUSES]?.label}`,
        })
        
        // Actualizar estado localmente
        const updatedOrder = { 
          ...selectedOrder, 
          estadoId: statusIdInt,
          estadoNombre: ORDER_STATUSES[statusIdInt as keyof typeof ORDER_STATUSES]?.label 
        }
        
        setSelectedOrder(updatedOrder)
        
        // Actualizar lista
        setOrders(orders.map(o => o.id === selectedOrder.id ? updatedOrder : o))
      } else {
        throw new Error("Falló la actualización")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado",
        variant: "destructive",
      })
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusBadge = (statusId: number, statusName: string) => {
    const config = ORDER_STATUSES[statusId as keyof typeof ORDER_STATUSES] || { label: statusName, color: "bg-gray-100 text-gray-800 border-gray-200", icon: Clock }
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} hover:${config.color} border flex items-center gap-1.5 px-2.5 py-0.5 w-fit shadow-sm`}>
        <Icon className="h-3.5 w-3.5" /> {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: es })
    } catch (e) {
      return dateString
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount || 0)
  }

  const getDeliveryDeadline = (order: any) => {
    if (!order.fechaVenta) return null
    
    const purchaseDate = new Date(order.fechaVenta)
    const total = order.total || 0
    
    // Lógica de negocio:
    // <= $500,000 -> 1 semana
    // > $500,000 -> 2 semanas
    const weeksToAdd = total <= 500000 ? 1 : 2
    const deadline = addWeeks(purchaseDate, weeksToAdd)
    
    return deadline
  }

  const getDeadlineBadge = (order: any) => {
    const deadline = getDeliveryDeadline(order)
    if (!deadline) return <span className="text-muted-foreground text-xs">N/A</span>

    // Estados finalizados: 3 (Enviada), 4 (Cancelada), 5 (Entregada)
    const isCompleted = [3, 4, 5].includes(order.estadoId)
    
    const isLate = isPast(deadline) && !isSameDay(deadline, new Date()) && !isCompleted
    const daysLeft = differenceInDays(deadline, new Date())
    
    // Chip 1: Fecha Límite
    const dateBadge = (
        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 flex items-center gap-1.5 font-normal whitespace-nowrap w-fit">
          <Calendar className="h-3 w-3" />
          {format(deadline, "dd MMM", { locale: es })}
        </Badge>
    )

    if (isCompleted) {
        return (
            <div className="flex flex-wrap items-center gap-2">
                {dateBadge}
            </div>
        )
    }

    // Chip 2: Días Restantes
    let daysColor = "bg-emerald-100 text-emerald-700 border-emerald-200"
    let daysText = `${daysLeft} días`
    
    if (isLate) {
        daysColor = "bg-red-100 text-red-700 border-red-200"
        daysText = `${Math.abs(daysLeft)} días atrasado`
    } else if (daysLeft === 0) {
         daysColor = "bg-orange-100 text-orange-700 border-orange-200"
         daysText = "Hoy"
    } else if (daysLeft <= 2) {
        daysColor = "bg-amber-100 text-amber-700 border-amber-200"
    }

    return (
      <div className="flex flex-wrap items-center gap-2">
        {dateBadge}
        <Badge variant="outline" className={`${daysColor} border flex items-center gap-1.5 font-normal whitespace-nowrap`}>
            {daysText}
        </Badge>
      </div>
    )
  }

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.estadoId === 3 || o.estadoId === 5).length,
    pending: orders.filter(o => o.estadoId === 0 || o.estadoId === 1 || o.estadoId === 2).length,
    late: orders.filter(o => {
      if (o.estadoId === 3 || o.estadoId === 4 || o.estadoId === 5) return false
      const deadline = getDeliveryDeadline(o)
      if (!deadline) return false
      const daysLeft = differenceInDays(deadline, new Date())
      return daysLeft <= 2
    }).length
  }

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pedidos</h1>
          <p className="text-muted-foreground">Gestión y seguimiento de órdenes de compra</p>
        </div>
        <Button variant="outline" size="icon" onClick={loadOrders} disabled={loading} className="bg-white shadow-sm">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Envíos Realizados</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riesgo de Retraso</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.late}</div>
            <p className="text-xs text-muted-foreground">
              Atrasados o &lt; 2 días
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por ID, cliente..." className="pl-8 bg-slate-50 border-slate-200" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px] bg-slate-50 border-slate-200">
              <Filter className="mr-2 h-4 w-4 text-slate-500" />
              <SelectValue placeholder="Filtrar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="0">Pendiente</SelectItem>
              <SelectItem value="1">Procesando</SelectItem>
              <SelectItem value="2">Pagada</SelectItem>
              <SelectItem value="3">Enviada</SelectItem>
              <SelectItem value="5">Entregada</SelectItem>
              <SelectItem value="4">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[80px] font-semibold text-slate-700">ID</TableHead>
              <TableHead className="font-semibold text-slate-700">Cliente</TableHead>
              <TableHead className="font-semibold text-slate-700">Fecha Compra</TableHead>
              <TableHead className="font-semibold text-slate-700">Límite Entrega</TableHead>
              <TableHead className="text-center font-semibold text-slate-700">Cant.</TableHead>
              <TableHead className="font-semibold text-slate-700">Estado</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Total</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Cargando pedidos...
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No hay pedidos registrados
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-slate-50/80 transition-colors" onClick={() => handleViewOrder(order)}>
                  <TableCell className="font-medium text-slate-900">
                    <Badge variant="outline" className="bg-slate-100 border-slate-200 text-slate-700">
                        #{order.id}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{order.nombreUsuario || "Usuario Desconocido"}</span>
                      <span className="text-xs text-muted-foreground">{order.emailUsuario}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {formatDate(order.fechaVenta)}
                  </TableCell>
                  <TableCell>
                    {getDeadlineBadge(order)}
                  </TableCell>
                  <TableCell className="text-center font-medium text-slate-600">
                    {order.items?.reduce((acc: any, item: any) => acc + item.cantidad, 0) || 0}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.estadoId, order.estadoNombre)}</TableCell>
                  <TableCell className="text-right font-bold text-slate-900">{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600" onClick={(e) => { e.stopPropagation(); handleViewOrder(order); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6 pb-4 border-b">
            <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-base px-3 py-1 bg-slate-100">
                    Pedido #{selectedOrder?.id}
                </Badge>
                {selectedOrder && getStatusBadge(selectedOrder.estadoId, selectedOrder.estadoNombre)}
            </div>
            <SheetTitle className="text-xl">Detalles del Pedido</SheetTitle>
            <SheetDescription>
              Información completa y gestión del pedido.
            </SheetDescription>
          </SheetHeader>

          {selectedOrder && (
            <div className="space-y-8">
              {/* Acciones de Estado */}
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-semibold mb-3 text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <RefreshCw className="h-3.5 w-3.5" />
                    Actualizar Estado
                </h3>
                <div className="flex gap-2">
                  <Select 
                    value={selectedOrder.estadoId?.toString()} 
                    onValueChange={handleStatusChange}
                    disabled={updatingStatus}
                  >
                    <SelectTrigger className="w-full bg-white border-slate-200 h-10">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Pendiente</SelectItem>
                      <SelectItem value="1">Procesando</SelectItem>
                      <SelectItem value="2">Pagada</SelectItem>
                      <SelectItem value="3">Enviada</SelectItem>
                      <SelectItem value="5">Entregada</SelectItem>
                      <SelectItem value="4">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Información del Cliente */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                  <User className="h-5 w-5 text-slate-500" />
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm p-4 border rounded-xl bg-white shadow-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Nombre</p>
                    <p className="font-medium text-slate-900">{selectedOrder.nombreUsuario}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="font-medium text-slate-900">{selectedOrder.emailUsuario || "No disponible"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Fecha de Compra</p>
                    <p className="font-medium text-slate-900">{formatDate(selectedOrder.fechaVenta)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Límite de Entrega</p>
                    <div className="flex items-center gap-2">
                        {getDeadlineBadge(selectedOrder)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                  <Package className="h-5 w-5 text-slate-500" />
                  Productos ({selectedOrder.items?.length || 0})
                </h3>
                <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="text-xs uppercase tracking-wider font-semibold text-slate-500">Producto</TableHead>
                        <TableHead className="text-right text-xs uppercase tracking-wider font-semibold text-slate-500">Cant.</TableHead>
                        <TableHead className="text-right text-xs uppercase tracking-wider font-semibold text-slate-500">Precio</TableHead>
                        <TableHead className="text-right text-xs uppercase tracking-wider font-semibold text-slate-500">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((item: any) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50">
                          <TableCell className="font-medium text-slate-900">{item.nombreProducto}</TableCell>
                          <TableCell className="text-right text-slate-600">{item.cantidad}</TableCell>
                          <TableCell className="text-right text-slate-600">{formatCurrency(item.precioUnitario)}</TableCell>
                          <TableCell className="text-right font-medium text-slate-900">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-slate-50/80 font-bold border-t-2 border-slate-100">
                        <TableCell colSpan={3} className="text-right text-slate-700">Total</TableCell>
                        <TableCell className="text-right text-lg text-slate-900">{formatCurrency(selectedOrder.total)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Dirección de Envío (Placeholder si no viene en el DTO) */}
              {selectedOrder.direccionEnvioId && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                    <Truck className="h-5 w-5 text-slate-500" />
                    Envío
                  </h3>
                  <div className="p-4 border rounded-xl bg-slate-50 text-sm text-slate-600">
                    <p className="text-muted-foreground mb-1 text-xs uppercase tracking-wider">ID Dirección</p>
                    <p className="font-medium text-slate-900">#{selectedOrder.direccionEnvioId}</p>
                    {/* Aquí se podría cargar la dirección completa si estuviera disponible */}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <SheetFooter className="mt-8 pt-4 border-t">
            <SheetClose asChild>
              <Button variant="outline" className="w-full h-11 text-base">Cerrar Detalles</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
