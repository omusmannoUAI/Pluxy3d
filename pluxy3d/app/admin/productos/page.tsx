"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import { formatPriceSimple } from "@/lib/helpers"
import { 
  Search, 
  Plus,
  Filter, 
  Download, 
  Eye, 
  Edit, 
  MoreHorizontal,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductAdmin {
  id: number
  name: string
  category: string
  price: number
  stock: number
  active: boolean
  image?: string
}

export default function AdminProductosPage() {
  const [products, setProducts] = useState<ProductAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todas las categorías")
  const [statusFilter, setStatusFilter] = useState("Todos los estados")

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await apiFetch('/productos?pageSize=100')
        if (response.items && Array.isArray(response.items)) {
          const mappedProducts: ProductAdmin[] = response.items.map((item: any) => ({
            id: item.id,
            name: item.nombre || item.name,
            category: item.categoria || item.category || 'Sin categoría',
            price: Number(item.precio || item.price || 0),
            stock: Number(item.stock || item.cantidad || 0),
            active: item.activo !== false, // Default to true unless explicitly false
            image: item.imagen || item.image
          }))
          setProducts(mappedProducts)
        }
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === "Todas las categorías" || 
      product.category === categoryFilter
    
    const matchesStatus = statusFilter === "Todos los estados" ||
      (statusFilter === "Activos" && product.active) ||
      (statusFilter === "Inactivos" && !product.active) ||
      (statusFilter === "Stock bajo" && product.stock < 10)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Sin stock", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400", icon: XCircle }
    if (stock < 10) return { label: "Stock bajo", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", icon: AlertTriangle }
    return { label: "En stock", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400", icon: CheckCircle }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Gestiona el catálogo de productos de la tienda
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Productos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{products.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Activos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {products.filter(p => p.active).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Bajo</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {products.filter(p => p.stock < 10).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sin Stock</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {products.filter(p => p.stock === 0).length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas las categorías">Todas las categorías</SelectItem>
                <SelectItem value="Impresoras 3D">Impresoras 3D</SelectItem>
                <SelectItem value="Filamentos">Filamentos</SelectItem>
                <SelectItem value="Accesorios">Accesorios</SelectItem>
                <SelectItem value="Repuestos">Repuestos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos los estados">Todos los estados</SelectItem>
                <SelectItem value="Activos">Activos</SelectItem>
                <SelectItem value="Inactivos">Inactivos</SelectItem>
                <SelectItem value="Stock bajo">Stock bajo</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex-shrink-0">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products list */}
      <Card>
        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron productos
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock)
                const StatusIcon = stockStatus.icon
                
                return (
                  <div key={product.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {product.name}
                            </h3>
                            <Badge 
                              variant={product.active ? "default" : "secondary"}
                              className={cn(
                                product.active 
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                              )}
                            >
                              {product.active ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {product.category}
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatPriceSimple(product.price)}
                            </span>
                            <Badge className={stockStatus.color}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {stockStatus.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Stock: {product.stock}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {product.id}
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
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
