import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProductCard } from "@/components/shared/ProductCard"

const featuredProducts = [
  {
    id: 1,
    name: "Creality Ender 3 V2",
    description: "Impresora 3D de alta calidad para principiantes y profesionales.",
    price: 320000,
    image: "/ender3v2.webp?height=300&width=400",
  category: "impresora",
  brand: "Creality",
  },
  {
    id: 2,
    name: "Kit Mejora Ender-3",
    description: "Kit de mejora para tu impresora Ender 3 con extrusor, teflón y resortes.",
    price: 22750,
    image: "/kitmejora.webp?height=300&width=400",
  category: "componente",
  brand: "Creality",
  },
  {
    id: 3,
    name: "Kit Doble Tracción",
    description: "Sistema de doble tracción para mejorar la precisión de tus impresiones.",
    price: 19000,
    image: "/doble.webp?height=300&width=400",
  category: "componente",
  brand: "Creality",
  },
]

export default function FeaturedProductsSection() {
  return (    <section className="container mx-auto w-full">
      <h2 className="text-3xl font-bold text-center mb-12">Productos Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            showBrand={false}
          />
        ))}
      </div>
      <div className="text-center mt-10">
        <Button asChild size="lg">
          <Link href="/productos">Ver Todos los Productos</Link>
        </Button>
      </div>
    </section>
  )
}
