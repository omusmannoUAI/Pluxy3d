"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { ProductCard } from "@/components/shared/ProductCard"
import { Product } from "@/lib/types"
import { ProductFilters } from "@/components/shared/ProductFilters"
import { useState, useEffect, useRef } from "react"
import { apiFetch } from "@/lib/api"

export default function ProductosPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number]>([500000])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<{ id: number; label: string; count?: number }[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const didInitialLoad = useRef(false)

  // Load products from backend
  useEffect(() => {
    if (didInitialLoad.current) return
    didInitialLoad.current = true
    const loadInitial = async () => {
      try {
        setLoading(true)
        const [cats, prods] = await Promise.all([
          apiFetch('/categorias'),
          apiFetch('/productos')
        ])
        if (Array.isArray(cats)) {
          setCategories(cats.map((c: any) => ({ id: c.id, label: c.name, count: c.count })))
        }
        if (Array.isArray(prods)) {
          const mappedProducts = prods.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: Number(p.price ?? 0),
            image: p.image,
            category: p.category,
            brand: p.brand
          })) as Product[]
          setProducts(mappedProducts)
        } else {
          setProducts([])
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadInitial()
  }, [])

  useEffect(() => {
    const loadByCategory = async () => {
      if (activeTab === 'all') return
      setLoading(true)
      try {
        const categoryId = Number(activeTab)
        const data = await apiFetch(`/productos?categoryId=${categoryId}`)
        if (Array.isArray(data)) {
          const mapped = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: Number(p.price ?? 0),
            image: p.image,
            category: p.category,
            brand: p.brand
          })) as Product[]
          setProducts(mapped)
        }
      } catch (e) {
        console.error('Error loading category products:', e)
      } finally {
        setLoading(false)
      }
    }
    loadByCategory()
  }, [activeTab])

  // categories now loaded from backend

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
            categories={categories.map(c => ({ id: String(c.id), label: c.label, count: c.count }))}
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
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="w-full flex justify-start overflow-x-auto">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {categories.map(c => (
                <TabsTrigger key={c.id} value={String(c.id)}>{c.label}</TabsTrigger>
              ))}
            </TabsList>            <TabsContent value="all" className="mt-6">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg h-64"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </TabsContent>

            {categories.map(c => (
              <TabsContent key={c.id} value={String(c.id)} className="mt-6">
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-lg h-64"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}

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
    </div>  )
}
