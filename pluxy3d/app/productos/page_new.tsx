"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { ProductCard } from "@/components/shared/ProductCard"
import type { Product } from "@/lib/types"
import { ProductFilters } from "@/components/shared/ProductFilters"
import { useState } from "react"

export default function ProductosPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number]>([500000])

  const categories = [
    { id: "impresoras", label: "Impresoras 3D", count: 5 },
    { id: "extrusores", label: "Extrusores", count: 3 },
    { id: "hotend", label: "HotEnd", count: 4 },
    { id: "placas", label: "Placas de Impresión", count: 2 },
    { id: "resortes", label: "Resortes", count: 6 }
  ]

  const brands = [
    { id: "creality", label: "Creality", count: 8 },
    { id: "hellbot", label: "Hellbot", count: 4 },
    { id: "prusa", label: "Prusa", count: 2 }
  ]

  const handleApplyFilters = () => {
    // Apply filtering logic here
    console.log({ selectedCategories, selectedBrands, priceRange })
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange([500000])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Productos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div>
          <ProductFilters
            categories={categories}
            brands={brands}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            priceRange={priceRange}
            maxPrice={500000}
            onCategoriesChange={setSelectedCategories}
            onBrandsChange={setSelectedBrands}
            onPriceRangeChange={setPriceRange}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar productos..." className="pl-10" />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="sort" className="whitespace-nowrap">
                Ordenar por:
              </Label>
              <select
                id="sort"
                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="newest">Más Recientes</option>
              </select>
            </div>
          </div>

          {/* Product Categories Tabs */}
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="w-full flex justify-start overflow-x-auto">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="impresoras">Impresoras</TabsTrigger>
              <TabsTrigger value="componentes">Componentes</TabsTrigger>
              <TabsTrigger value="filamentos">Filamentos</TabsTrigger>
              <TabsTrigger value="accesorios">Accesorios</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="impresoras" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter((product) => product.category === "impresora")
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="componentes" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products
                  .filter((product) => product.category === "componente")
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="filamentos" className="mt-6">
              <p className="text-center py-8 text-muted-foreground">No hay productos en esta categoría.</p>
            </TabsContent>

            <TabsContent value="accesorios" className="mt-6">
              <p className="text-center py-8 text-muted-foreground">No hay productos en esta categoría.</p>
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-1">
              <Button variant="outline" size="icon" disabled>
                &lt;
              </Button>
              <Button variant="purple" size="icon">
                1
              </Button>
              <Button variant="outline" size="icon">
                2
              </Button>
              <Button variant="outline" size="icon">
                3
              </Button>
              <Button variant="outline" size="icon">
                &gt;
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

const products: Product[] = [
  {
    id: 1,
    name: "Creality Ender 3 V2",
    description: "Impresora 3D de alta calidad para principiantes y profesionales.",
    price: 320000,
    image: "/ender3v2.webp",
    category: "impresora",
    brand: "Creality",
  },
  {
    id: 2,
    name: "Kit Mejora Ender-3",
    description: "Kit de mejora para tu impresora Ender 3 con extrusor, teflón y resortes.",
    price: 22750,
    image: "/kitmejora.webp",
    category: "componente",
    brand: "Creality",
  },
  {
    id: 3,
    name: "Kit Doble Tracción",
    description: "Sistema de doble tracción para mejorar la precisión de tus impresiones.",
    price: 19000,
    image: "/doble.webp",
    category: "componente",
    brand: "Creality",
  },
  {
    id: 4,
    name: "Hellbot Magna 2",
    description: "Impresora 3D de gran formato con doble extrusor y cama caliente.",
    price: 450000,
    image: "/placeholder.svg?height=300&width=400",
    category: "impresora",
    brand: "Hellbot",
  },
  {
    id: 5,
    name: "Prusa i3 MK3S+",
    description: "La impresora 3D más confiable del mercado, con excelente calidad de impresión.",
    price: 520000,
    image: "/placeholder.svg?height=300&width=400",
    category: "impresora",
    brand: "Prusa",
  },
  {
    id: 6,
    name: "HotEnd V6",
    description: "HotEnd de alta temperatura para filamentos técnicos y abrasivos.",
    price: 15000,
    image: "/placeholder.svg?height=300&width=400",
    category: "componente",
    brand: "Creality",
  },
]
