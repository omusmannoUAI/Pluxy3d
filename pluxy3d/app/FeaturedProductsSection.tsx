"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"
import { formatPriceSimple } from "@/lib/helpers"
import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"

type BadgeVariant = "green" | "red" | "purple" | "emerald"
type FP = {
  id: number
  name: string
  description: string
  price: number
  oldPrice?: number
  image: string
  href: string
  badge?: { label: string; variant: BadgeVariant }
  rating?: number
  reviews?: number
}

function Stars({ value = 0 }: { value?: number }) {
  const full = Math.round(value)
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < full ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  )
}

export default function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState<FP[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        // Prefer a small paginated request for featured items
        const data = await apiFetch('/productos?page=1&pageSize=4')

        // Normalize possible response shapes: { items: [] } | { data: [] } | { results: [] } | []
        let productItems: any[] = []
        if (data && Array.isArray(data)) {
          productItems = data
        } else if (data && Array.isArray(data.items)) {
          productItems = data.items
        } else if (data && Array.isArray(data.data)) {
          productItems = data.data
        } else if (data && Array.isArray(data.results)) {
          productItems = data.results
        }

        if (productItems.length > 0) {
          const products: FP[] = productItems.slice(0, 4).map((item: any, index: number) => ({
            id: Number(item.id),
            name: String(item.nombre || item.Nombre || item.name || item.titulo || 'Producto'),
            description: String(item.descripcion || item.Descripcion || item.description || 'Producto de alta calidad'),
            price: Number(item.precio ?? item.Precio ?? item.price ?? 0),
            image: String(item.imagen || item.Image || item.image || '/placeholder.svg'),
            href: `/productos/id/${item.id}`,
            rating: Number(item.rating ?? item.calificacion ?? 4.0),
            reviews: Number(item.reviews ?? item.Resenas ?? Math.floor(Math.random() * 200) + 50),
            badge: index === 0 ? { label: 'Más Vendido', variant: 'green' as BadgeVariant } :
                   index === 1 ? { label: 'Oferta', variant: 'red' as BadgeVariant } :
                   index === 2 ? { label: 'Premium', variant: 'purple' as BadgeVariant } :
                   { label: 'Destacado', variant: 'emerald' as BadgeVariant }
          }))

          setFeaturedProducts(products)
        } else {
          // No items found, clear list (component renders a friendly message)
          setFeaturedProducts([])
        }
      } catch (error) {
        // swallow error and render fallback UI
        setFeaturedProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto w-full py-12 md:py-14">
        <div className="text-center mb-2">
          <h2 className="text-3xl md:text-4xl font-bold">Productos Destacados</h2>
        </div>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          Descubre nuestra selección de productos más populares y mejor valorados por nuestros clientes
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border rounded-xl overflow-hidden shadow-sm bg-background">
              <div className="h-64 w-full bg-gray-200 animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="container mx-auto w-full py-12 md:py-14">
        <div className="text-center mb-2">
          <h2 className="text-3xl md:text-4xl font-bold">Productos Destacados</h2>
        </div>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          Descubre nuestra selección de productos más populares y mejor valorados por nuestros clientes
        </p>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se pudieron cargar los productos destacados.</p>
          <p className="text-sm text-muted-foreground mt-2">Intenta recargar la página o visita la sección de productos.</p>
        </div>
        <div className="text-center mt-10">
          <Button asChild size="lg" variant="outline">
            <Link href="/productos" className="inline-flex items-center gap-2">
              Ver Todos los Productos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="container mx-auto w-full py-12 md:py-14">
      <div className="text-center mb-2">
        <h2 className="text-3xl md:text-4xl font-bold">Productos Destacados</h2>
      </div>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Descubre nuestra selección de productos más populares y mejor valorados por nuestros clientes
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((p) => (
          <div key={p.id} className="border rounded-xl overflow-hidden shadow-sm bg-background hover:shadow-md transition-shadow">
            <div className="relative h-64 w-full">
              {p.badge && (
                <span className={`absolute top-3 left-3 text-[11px] px-2 py-1 rounded-full text-white font-semibold z-10 ${
                  p.badge.variant === 'green' ? 'bg-green-500' : p.badge.variant === 'red' ? 'bg-red-500' : p.badge.variant === 'purple' ? 'bg-purple-600' : 'bg-emerald-500'
                }`}>
                  {p.badge.label}
                </span>
              )}
              <Image 
                src={p.image} 
                alt={p.name} 
                fill 
                className="object-cover" 
                sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1 line-clamp-2">{p.name}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{p.description}</p>
              <div className="flex items-center gap-2 text-sm mb-2">
                <Stars value={p.rating} />
                <span className="text-muted-foreground">({p.reviews})</span>
              </div>
              <div className="mb-3">
                <span className="text-primary text-xl font-bold mr-2">{formatPriceSimple(p.price)}</span>
                {p.oldPrice && (
                  <span className="text-sm line-through text-muted-foreground">{formatPriceSimple(p.oldPrice)}</span>
                )}
              </div>
              <Button asChild className="w-full" variant="purple">
                <Link href={p.href}>Ver Producto</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Button asChild size="lg" variant="outline">
          <Link href="/productos" className="inline-flex items-center gap-2">
            Ver Todos los Productos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
