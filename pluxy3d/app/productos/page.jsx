"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Filter, Search, ShoppingCart, Heart, AlertCircle, RefreshCcw, Star, Grid, List } from "lucide-react"
import { getProducts, getCategories, getBrands } from "@/services/api"
import { useCart } from "@/contexts/CartContext"

export default function ProductosPage() {
  // Estados para los productos y filtros
  /**
   * @type {[Array, Function]} productos y función para actualizarlos
   */
  const [products, setProducts] = useState([])

  /**
   * @type {[Array, Function]} categorías y función para actualizarlas
   */
  const [categories, setCategories] = useState([])

  /**
   * @type {[Array, Function]} marcas y función para actualizarlas
   */
  const [brands, setBrands] = useState([])

  /**
   * @type {[boolean, Function]} estado de carga
   */
  const [loading, setLoading] = useState(true)

  /**
   * @type {[string|null, Function]} mensaje de error
   */
  const [error, setError] = useState(null)

  // Estados para los filtros
  /**
   * @type {[string, Function]} categoría seleccionada
   */
  const [selectedCategory, setSelectedCategory] = useState("")

  /**
   * @type {[Array<string>, Function]} marcas seleccionadas
   */
  const [selectedBrands, setSelectedBrands] = useState([])

  /**
   * @type {[Array<number>, Function]} rango de precios
   */
  const [priceRange, setPriceRange] = useState([0])

  /**
   * @type {[string, Function]} consulta de búsqueda
   */
  const [searchQuery, setSearchQuery] = useState("")

  /**
   * @type {[string, Function]} opción de ordenamiento
   */
  const [sortOption, setSortOption] = useState("relevance")

  /**
   * @type {[string, Function]} vista de productos (grid o list)
   */
  const [viewMode, setViewMode] = useState("grid")

  // Cargar productos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Cargar productos, categorías y marcas en paralelo
        const [productsData, categoriesData, brandsData] = await Promise.all([
          getProducts(),
          getCategories(),
          getBrands(),
        ])

        console.log("[v0] Products loaded:", productsData.length)
        setProducts(productsData)
        setCategories(categoriesData)
        setBrands(brandsData)
      } catch (err) {
        console.error("Error al cargar datos iniciales:", err)
        setError("No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Now only triggers when filter values change, not on loading state
  useEffect(() => {
    const applyFilters = async () => {
      try {
        setLoading(true)
        setError(null)

        // Construir opciones de filtrado
        const filterOptions = {
          category: selectedCategory || undefined,
          brand: selectedBrands.length > 0 ? selectedBrands : undefined,
          minPrice: priceRange[0] || undefined,
          maxPrice: 500000, // Valor máximo del slider
          sort: sortOption !== "relevance" ? sortOption : undefined,
        }

        console.log("[v0] Applying filters:", filterOptions)
        // Obtener productos filtrados
        const filteredProducts = await getProducts(filterOptions)
        console.log("[v0] Filtered products:", filteredProducts.length)
        setProducts(filteredProducts)
      } catch (err) {
        console.error("Error al aplicar filtros:", err)
        setError("No se pudieron aplicar los filtros. Por favor, intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    applyFilters()
  }, [selectedCategory, selectedBrands, priceRange, sortOption])

  /**
   * Manejar cambio en marcas seleccionadas
   * @param {string} brand - Marca seleccionada
   * @param {boolean} isChecked - Si está seleccionada o no
   */
  const handleBrandChange = (brand, isChecked) => {
    if (isChecked) {
      setSelectedBrands([...selectedBrands, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  }

  /**
   * Manejar búsqueda
   * @param {Event} e - Evento del formulario
   */
  const handleSearch = (e) => {
    e.preventDefault()
    // Implementar búsqueda (podría ser local o en el servidor)
    // Por ahora, filtramos localmente
    if (searchQuery.trim()) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setProducts(filtered)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Productos</h1>
          <p className="text-gray-600">Descubre nuestra amplia selección de impresoras 3D y componentes</p>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Layout principal */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar de filtros - Desktop */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Filter className="mr-2 h-5 w-5" />
                    Filtros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Categories */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Categorías</h3>
                    <div className="space-y-3">
                      {loading
                        ? Array(5)
                            .fill()
                            .map((_, i) => (
                              <div key={i} className="flex items-center space-x-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-32 rounded" />
                              </div>
                            ))
                        : categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${category.id}`}
                                checked={selectedCategory === category.id.toString()}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCategory(category.id.toString())
                                  } else {
                                    setSelectedCategory("")
                                  }
                                }}
                              />
                              <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                                {category.name}
                              </Label>
                            </div>
                          ))}
                    </div>
                  </div>

                  {/* Brands */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Marcas</h3>
                    <div className="space-y-3">
                      {loading
                        ? Array(3)
                            .fill()
                            .map((_, i) => (
                              <div key={i} className="flex items-center space-x-2">
                                <Skeleton className="h-4 w-4 rounded" />
                                <Skeleton className="h-4 w-24 rounded" />
                              </div>
                            ))
                        : brands.map((brand) => (
                            <div key={brand.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`brand-${brand.id}`}
                                checked={selectedBrands.includes(brand.id.toString())}
                                onCheckedChange={(checked) => {
                                  handleBrandChange(brand.id.toString(), checked)
                                }}
                              />
                              <Label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                                {brand.name}
                              </Label>
                            </div>
                          ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Rango de Precio</h3>
                    <Slider value={priceRange} max={500000} step={1000} onValueChange={setPriceRange} />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>$0</span>
                      <span className="font-medium">${priceRange[0].toLocaleString("es-AR")}</span>
                      <span>$500.000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">
            {/* Barra de búsqueda y controles */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <form onSubmit={handleSearch} className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
                <div className="flex items-center gap-2">
                  <Label htmlFor="sort" className="whitespace-nowrap text-sm">
                    Ordenar:
                  </Label>
                  <select
                    id="sort"
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="relevance">Relevancia</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                    <option value="newest">Más Recientes</option>
                  </select>
                </div>
              </div>

              {/* Controles de vista y filtros móvil */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="lg:hidden"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="lg:hidden"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </div>
            </div>

            {/* Tabs de categorías */}
            <Tabs value={selectedCategory || "all"} onValueChange={(val) => setSelectedCategory(val === "all" ? "" : val)} className="mb-6">
              <TabsList className="w-full flex justify-start overflow-x-auto">
                <TabsTrigger value="all">
                  Todos
                </TabsTrigger>
                {!loading &&
                  categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
              </TabsList>

              <TabsContent value="all" className="mt-6">
                {loading ? (
                  <ProductsGrid loading={true} />
                ) : products.length > 0 ? (
                  <ProductsGrid products={products} viewMode={viewMode} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                      No se encontraron productos que coincidan con los filtros.
                    </p>
                    <Button onClick={() => window.location.reload()} variant="outline">
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Reiniciar filtros
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Contenido para cada categoría */}
              {!loading &&
                categories.map((category) => (
                  <TabsContent key={category.id} value={category.id.toString()} className="mt-6">
                    {products.length > 0 ? (
                      <ProductsGrid products={products} viewMode={viewMode} />
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No hay productos en esta categoría.</p>
                      </div>
                    )}
                  </TabsContent>
                ))}
            </Tabs>

            {/* Paginación */}
            {!loading && products.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <Button variant="outline" size="icon" disabled>
                    &lt;
                  </Button>
                  <Button variant="outline" size="icon" className="bg-purple-600 text-white">
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Componente de grid de productos
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.products - Lista de productos
 * @param {boolean} props.loading - Estado de carga
 * @param {string} props.viewMode - Modo de vista (grid o list)
 */
function ProductsGrid({ products = [], loading = false, viewMode = "grid" }) {
  if (loading) {
    return (
      <div
        className={`grid gap-4 md:gap-6 ${
          viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        }`}
      >
        {Array(8)
          .fill()
          .map((_, i) => (
            <ProductSkeleton key={i} viewMode={viewMode} />
          ))}
      </div>
    )
  }

  return (
    <div
      className={`grid gap-4 md:gap-6 ${
        viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  )
}

/**
 * Componente de tarjeta de producto
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.product - Datos del producto
 * @param {string} props.viewMode - Modo de vista
 */
function ProductCard({ product, viewMode = "grid" }) {
  const isListView = viewMode === "list"
  const { addToCart } = useCart()

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
        isListView ? "flex flex-row" : ""
      }`}
    >
      <div className={`relative ${isListView ? "w-48 shrink-0" : "aspect-square"}`}>
        <Image
          src={product.imageUrl || "/placeholder.svg?height=300&width=400"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Agregar a favoritos"
        >
          <Heart className="h-4 w-4" />
        </Button>
        {product.originalPrice && product.originalPrice > product.price && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </Badge>
        )}
      </div>

      <div className={`flex flex-col ${isListView ? "flex-1 p-4" : ""}`}>
        <CardHeader className={isListView ? "p-0 pb-2" : ""}>
          <div className="text-sm text-muted-foreground">{product.brandName}</div>
          <CardTitle className={`${isListView ? "text-lg" : "text-base"} line-clamp-2`}>{product.name}</CardTitle>
        </CardHeader>

        <CardContent className={`flex-1 ${isListView ? "p-0 py-2" : ""}`}>
          <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    }`}
                  />
                ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">({product.reviewCount || 0})</span>
          </div>

          {/* Price */}
          <div className="mb-4">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm line-through text-muted-foreground mr-2">
                ${product.originalPrice.toLocaleString("es-AR")}
              </span>
            )}
            <span className="text-xl font-bold text-purple-600">
              ${product.price ? product.price.toLocaleString("es-AR") : "0"}
            </span>
          </div>
        </CardContent>

        <CardFooter className={`flex gap-2 ${isListView ? "p-0 pt-2" : "flex-col"}`}>
          <Button variant="outline" asChild className={isListView ? "flex-1" : "w-full"}>
            <Link href={`/productos/${product.id}`}>Ver Detalles</Link>
          </Button>
          <Button
            className={`bg-purple-600 hover:bg-purple-700 ${isListView ? "flex-1" : "w-full"}`}
            onClick={() => addToCart(product)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Agregar
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

/**
 * Componente de esqueleto para la carga de productos
 * @param {Object} props - Propiedades del componente
 * @param {string} props.viewMode - Modo de vista
 */
function ProductSkeleton({ viewMode = "grid" }) {
  const isListView = viewMode === "list"

  return (
    <Card className={`overflow-hidden ${isListView ? "flex flex-row" : ""}`}>
      <div className={`relative ${isListView ? "w-48 shrink-0" : "aspect-square"}`}>
        <Skeleton className="w-full h-full" />
      </div>
      <div className={`flex flex-col ${isListView ? "flex-1 p-4" : ""}`}>
        <CardHeader className={isListView ? "p-0 pb-2" : ""}>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-6 w-full" />
        </CardHeader>
        <CardContent className={`flex-1 ${isListView ? "p-0 py-2" : ""}`}>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-6 w-24" />
        </CardContent>
        <CardFooter className={`${isListView ? "p-0 pt-2" : ""}`}>
          <div className={`flex gap-2 w-full ${isListView ? "" : "flex-col"}`}>
            <Skeleton className={`h-10 ${isListView ? "flex-1" : "w-full"}`} />
            <Skeleton className={`h-10 ${isListView ? "flex-1" : "w-full"}`} />
          </div>
        </CardFooter>
      </div>
    </Card>
  )
}
