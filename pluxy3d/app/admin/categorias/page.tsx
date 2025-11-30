"use client"

import { useEffect, useState } from "react"
import { 
  Search, 
  Download, 
  RefreshCw, 
  Tags, 
  CheckCircle2, 
  Layers, 
  Box,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCategories } from "@/services/api"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await getCategories()
      // Enrich data with mock values for UI demo
      const enrichedData = (Array.isArray(data) ? data : []).map(cat => ({
        ...cat,
        slug: `/${cat.name.toLowerCase().replace(/\s+/g, '-')}`,
        status: "Activa",
        productCount: Math.floor(Math.random() * 100) + 10,
        isMain: true
      }))
      setCategories(enrichedData)
    } catch (error) {
      console.error(error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    {
      title: "Total Categorías",
      value: categories.length,
      icon: Layers,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Activas",
      value: categories.filter(c => c.status === "Activa").length,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Principales",
      value: categories.filter(c => c.isMain).length,
      icon: Tags,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Total Productos",
      value: categories.reduce((acc, curr) => acc + curr.productCount, 0),
      icon: Box,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground">Gestiona categorías</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={loadCategories}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-muted-foreground">Organiza los productos en categorías y subcategorías</h2>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar categorías..." className="pl-8" />
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex gap-4 items-center">
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <Tags className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    {category.id === 3 && <Badge variant="outline">Subcategoría</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{category.description || "Sin descripción"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Slug: {category.slug}</p>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 mb-1">
                    {category.status}
                  </Badge>
                  <p className="text-sm font-medium">{category.productCount} productos</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
