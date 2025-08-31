import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"
import { formatPriceSimple } from "@/lib/helpers"

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

const featuredProducts: FP[] = [
  {
    id: 1,
    name: "Creality Ender 3 V2",
    description: "Impresora 3D de alta calidad para principiantes y profesionales.",
    price: 320000,
    oldPrice: 338000,
    image: "/ender3v2.webp",
    href: "/productos/id/1",
    badge: { label: "Más Vendido", variant: "green" },
    rating: 4.2,
    reviews: 234
  },
  {
    id: 2,
    name: "Kit Mejora Ender-3 Pro",
    description: "Kit de mejora para Ender 3 con extrusor, teflón y resortes.",
    price: 22750,
    oldPrice: 32500,
    image: "/kitmejora.webp",
    href: "/productos/id/2",
    badge: { label: "Oferta", variant: "red" },
    rating: 4.1,
    reviews: 189
  },
  {
    id: 3,
    name: "Hellbot Magna 2",
    description: "Impresora robusta con excelente calidad por capa.",
    price: 450000,
    oldPrice: 520000,
    image: "/hellbot.png",
    href: "/productos/id/3",
    badge: { label: "Premium", variant: "purple" },
    rating: 4.6,
    reviews: 67
  },
  {
    id: 4,
    name: "Filamento PLA Premium",
    description: "PLA Premium eco-friendly para resultados consistentes.",
    price: 15000,
    oldPrice: 18000,
    image: "/filamento.webp",
    href: "/productos/id/4",
    badge: { label: "Eco-Friendly", variant: "emerald" },
    rating: 4.0,
    reviews: 456
  }
]

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
          <div key={p.id} className="border rounded-xl overflow-hidden shadow-sm bg-background">
            <div className="relative h-64 w-full">
              {p.badge && (
                <span className={`absolute top-3 left-3 text-[11px] px-2 py-1 rounded-full text-white font-semibold ${
                  p.badge.variant === 'green' ? 'bg-green-500' : p.badge.variant === 'red' ? 'bg-red-500' : p.badge.variant === 'purple' ? 'bg-purple-600' : 'bg-emerald-500'
                }`}>
                  {p.badge.label}
                </span>
              )}
              <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 25vw" />
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1 line-clamp-1">{p.name}</h3>
              <div className="flex items-center gap-2 text-sm mb-2">
                <Stars value={p.rating} />
                <span className="text-muted-foreground">({p.reviews})</span>
              </div>
              <div className="mb-2">
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
