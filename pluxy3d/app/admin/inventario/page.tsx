"use client"

import { useEffect, useState } from "react"
import { 
  Search, 
  Download, 
  RefreshCw, 
  Package, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign,
  MoreHorizontal,
  Edit,
  Eye,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { getInventory } from "@/services/api"

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInventory()
  }, [])

  const loadInventory = async () => {
    setLoading(true)
    try {
      const response = await getInventory()
      // Handle paginated response
      const rawItems = response.items || (Array.isArray(response) ? response : [])
      
      // Map API data to component structure
      const mappedItems = rawItems.map((item: any) => ({
        id: item.id,
        name: item.nombre || "Producto sin nombre",
        sku: `SKU-${item.id.toString().padStart(6, '0')}`,
        location: "Almacén A", // Default value
        lastUpdated: new Date().toLocaleDateString(),
        stock: item.stock || 0,
        minStock: 10, // Default
        maxStock: 100, // Default
        status: (item.stock || 0) > 10 ? "Normal" : "Low",
        price: item.precioBase || 0
      }))

      setInventory(mappedItems)
    } catch (error) {
      console.error(error)
      setInventory([])
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Total Productos",
      value: inventory.length,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Stock Bajo",
      value: inventory.filter(i => i.status === "Low").length,
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      title: "Stock Normal",
      value: inventory.filter(i => i.status === "Normal").length,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Valor Total",
      value: `$${inventory.reduce((acc, item) => acc + (item.stock * (item.price || 0)), 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">Gestiona inventario</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={loadInventory}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar productos en inventario..." className="pl-8" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="low">Stock Bajo</SelectItem>
              <SelectItem value="out">Sin Stock</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {inventory.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>SKU: {item.sku}</p>
                      <div className="flex gap-2 items-center">
                        <span className="flex items-center gap-1">
                          <Package className="h-3 w-3" /> {item.location}
                        </span>
                        <span>•</span>
                        <span>Actualizado: {item.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <Badge variant={item.status === "Normal" ? "secondary" : "destructive"} className="mb-1">
                      {item.status === "Normal" ? "Normal" : "Stock Bajo"}
                    </Badge>
                    <p className="text-2xl font-bold">{item.stock}</p>
                    <p className="text-xs text-muted-foreground">
                      Min: {item.minStock} | Max: {item.maxStock}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>Ajustar Stock</DropdownMenuItem>
                        <DropdownMenuItem>Ver Historial</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
