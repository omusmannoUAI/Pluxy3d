"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import Image from "next/image"
import { Filter, Search, ShoppingCart, Heart } from "lucide-react"
import { useParams } from "next/navigation"
import { apiFetch } from "@/lib/api"
import { useEffect, useState } from "react"

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

export default function ProductosCategoriaPage() {
  const params = useParams();
  const categoria = params.categoria as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/productos")
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => p.category === categoria)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        Productos / {categoria}
      </h1>
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Sidebar de filtros igual que en productos */}
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
                    <Checkbox id="impresoras" checked={categoria === "impresora"} disabled />
                    <Label htmlFor="impresoras">Impresoras 3D</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="extrusores" disabled />
                    <Label htmlFor="extrusores">Extrusores</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hotend" disabled />
                    <Label htmlFor="hotend">HotEnd</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="placas" disabled />
                    <Label htmlFor="placas">Placas de Impresión</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="resortes" disabled />
                    <Label htmlFor="resortes">Resortes</Label>
                  </div>
                </div>
              </div>
              {/* Brands */}
              <div className="space-y-4">
                <h3 className="font-medium">Marcas</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="creality" disabled />
                    <Label htmlFor="creality">Creality</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hellbot" disabled />
                    <Label htmlFor="hellbot">Hellbot</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="prusa" disabled />
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
        {/* Productos filtrados */}
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-center py-8 text-muted-foreground w-full col-span-3">Cargando productos...</p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground w-full col-span-3">
                No hay productos para esta categoría.
              </p>
            ) : (
              filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
