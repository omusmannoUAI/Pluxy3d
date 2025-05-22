import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import Image from "next/image"
import { Filter, Search, ShoppingCart, Heart } from "lucide-react"

export default function ProductosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Productos</h1>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Categories */}
              <div className="space-y-4">
                <h3 className="font-medium">Categorías</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="impresoras" />
                    <Label htmlFor="impresoras">Impresoras 3D</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="extrusores" />
                    <Label htmlFor="extrusores">Extrusores</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hotend" />
                    <Label htmlFor="hotend">HotEnd</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="placas" />
                    <Label htmlFor="placas">Placas de Impresión</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="resortes" />
                    <Label htmlFor="resortes">Resortes</Label>
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-4">
                <h3 className="font-medium">Marcas</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="creality" />
                    <Label htmlFor="creality">Creality</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hellbot" />
                    <Label htmlFor="hellbot">Hellbot</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="prusa" />
                    <Label htmlFor="prusa">Prusa</Label>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <h3 className="font-medium">Rango de Precio</h3>
                <Slider defaultValue={[50000]} max={500000} step={1000} />
                <div className="flex items-center justify-between">
                  <span className="text-sm">$0</span>
                  <span className="text-sm">$500.000</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Aplicar Filtros</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="w-full md:w-3/4">
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
        </div>
      </div>
    </div>
  )
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  brand: string
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="relative h-48 w-full">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
          aria-label="Agregar a favoritos"
        >
          <Heart className="h-5 w-5" />
        </Button>
      </div>
      <CardHeader>
        <div className="text-sm text-muted-foreground">{product.brand}</div>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">{product.description}</p>
        <p className="text-xl font-bold">${product.price.toLocaleString()}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/productos/${product.id}`}>Ver Detalles</Link>
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar
        </Button>
      </CardFooter>
    </Card>
  )
}

const products: Product[] = [
  {
    id: 1,
    name: "Creality Ender 3 V2",
    description: "Impresora 3D de alta calidad para principiantes y profesionales.",
    price: 320000,
    image: "/placeholder.svg?height=300&width=400",
    category: "impresora",
    brand: "Creality",
  },
  {
    id: 2,
    name: "Kit Mejora Ender-3",
    description: "Kit de mejora para tu impresora Ender 3 con extrusor, teflón y resortes.",
    price: 22750,
    image: "/placeholder.svg?height=300&width=400",
    category: "componente",
    brand: "Creality",
  },
  {
    id: 3,
    name: "Kit Doble Tracción",
    description: "Sistema de doble tracción para mejorar la precisión de tus impresiones.",
    price: 19000,
    image: "/placeholder.svg?height=300&width=400",
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
