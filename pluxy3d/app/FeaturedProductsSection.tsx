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
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        console.log('Loading featured products from API...');
        console.log('Current origin:', window.location.origin);
        console.log('Environment API URL:', process.env.NEXT_PUBLIC_API_URL);
        
        // Clear any existing cache first
        if (typeof window !== 'undefined') {
          // Force clear browser cache for this request
          const timestamp = new Date().getTime();
          console.log('Cache buster timestamp:', timestamp);
        }
        
        // Try both apiFetch and direct fetch as fallback
        let data;
        try {
          console.log('Trying apiFetch...');
          // Force clear any cached requests first
          await fetch('/api/clear-cache', { method: 'POST' }).catch(() => {});
          data = await apiFetch('/productos?_=' + Date.now()); // Cache buster
          console.log('apiFetch successful:', data);
        } catch (apiFetchError) {
          console.log('apiFetch failed, trying direct fetch:', apiFetchError);
          
          // Direct fetch with explicit CORS headers
          const API_URL = 'http://localhost:5299/api';
          const response = await fetch(`${API_URL}/productos?_=${Date.now()}`, {
            method: 'GET',
            mode: 'cors', // Explicit CORS mode
            credentials: 'omit', // Don't send credentials
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            cache: 'no-cache' // Force no cache
          });
          
          console.log('Direct fetch response status:', response.status);
          console.log('Direct fetch response headers:', Array.from(response.headers.entries()));
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          
          data = await response.json();
          console.log('Direct fetch successful:', data);
        }
        
        console.log('API Response raw data:', JSON.stringify(data, null, 2));
        
        // Handle paginated response from API
        let productItems = []
        if (data && data.items && Array.isArray(data.items)) {
          console.log('Found items array with length:', data.items.length);
          productItems = data.items
        } else if (Array.isArray(data)) {
          console.log('Data is direct array with length:', data.length);
          productItems = data
        } else {
          console.log('Unexpected data structure:', typeof data, data);
        }

        console.log('Product items to process:', productItems.length);
        setDebugInfo(`Found ${productItems.length} products from API`);

        if (productItems.length > 0) {
          // Take first 4 products as featured
          const products: FP[] = productItems.slice(0, 4).map((item: any, index: number) => {
            console.log(`Processing product ${index}:`, item);
            return {
              id: item.id,
              name: item.nombre || item.name,
              description: item.descripcion || item.description || 'Producto de alta calidad',
              price: Number((item.precio || item.price) ?? 0),
              image: item.imagen || item.image || "/placeholder.svg",
              href: `/productos/id/${item.id}`,
              rating: Number(item.rating || item.calificacion || 4.0),
              reviews: item.reviews || Math.floor(Math.random() * 200) + 50,
              // Add badges based on position
              badge: index === 0 ? { label: "Más Vendido", variant: "green" as BadgeVariant } :
                     index === 1 ? { label: "Oferta", variant: "red" as BadgeVariant } :
                     index === 2 ? { label: "Premium", variant: "purple" as BadgeVariant } :
                     { label: "Destacado", variant: "emerald" as BadgeVariant }
            }
          })
          console.log('Mapped featured products:', products);
          setFeaturedProducts(products)
          setDebugInfo(`Successfully loaded ${products.length} featured products`);
          console.log('Featured products set:', products.length)
        } else {
          console.log('No products found in API response')
          setDebugInfo('No products found in API response');
        }
      } catch (error) {
        console.error('Error loading featured products:', error)
        setDebugInfo(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          <p className="text-sm text-muted-foreground mt-2">Revisa la consola del navegador para más detalles.</p>
          <div className="mt-4 p-4 bg-gray-100 rounded text-sm">
            <strong>Debug:</strong> {debugInfo || 'No debug info available'}
          </div>
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
