"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  MoreHorizontal,
  ShoppingBag,
  Package,
  Truck,
  CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

const statusConfig = {
  Pendientes: { 
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    icon: Package,
    count: 23
  },
  Procesando: { 
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    icon: ShoppingBag,
    count: 45
  },
  Enviados: { 
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    icon: Truck,
    count: 67
  },
  Entregados: { 
    color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    icon: CheckCircle,
    count: 234
  }
}

const orders = [
  { 
    id: 'ORD-001', 
    customer: 'Juan Pérez', 
    email: 'juan@example.com', 
    status: 'Procesando' as keyof typeof statusConfig, 
    total: '$389,099', 
    products: 3, 
    date: '2024-01-25' 
  },
  { 
    id: 'ORD-002', 
    customer: 'María García', 
    email: 'maria@example.com', 
    status: 'Enviados' as keyof typeof statusConfig, 
    total: '$45,000', 
    products: 1, 
    date: '2024-01-24' 
  },
  { 
    id: 'ORD-003', 
    customer: 'Carlos López', 
    email: 'carlos@example.com', 
    status: 'Entregados' as keyof typeof statusConfig, 
    total: '$125,000', 
    products: 2, 
    date: '2024-01-23' 
  },
]

export default function AdminPedidosPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("Todos los estados")

  return (
    <div className="space-y-6">
      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon
          return (
            <Card key={status} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {status}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {config.count}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar pedidos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos los estados">Todos los estados</SelectItem>
                <SelectItem value="Pendientes">Pendientes</SelectItem>
                <SelectItem value="Procesando">Procesando</SelectItem>
                <SelectItem value="Enviados">Enviados</SelectItem>
                <SelectItem value="Entregados">Entregados</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex-shrink-0">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders list */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {order.id}
                        </h3>
                        <Badge className={statusConfig[order.status].color}>
                          {order.status}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {order.customer}
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {order.email} • {order.date}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {order.total}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.products} productos
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
