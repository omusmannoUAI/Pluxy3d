import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

const featuredProducts = [
  {
    id: 1,
    name: "Creality Ender 3 V2",
    description: "Impresora 3D de alta calidad para principiantes y profesionales.",
    price: 320000,
    image: "/ender3v2.webp?height=300&width=400",
  },
  {
    id: 2,
    name: "Kit Mejora Ender-3",
    description: "Kit de mejora para tu impresora Ender 3 con extrusor, teflón y resortes.",
    price: 22750,
    image: "/kitmejora.webp?height=300&width=400",
  },
  {
    id: 3,
    name: "Kit Doble Tracción",
    description: "Sistema de doble tracción para mejorar la precisión de tus impresiones.",
    price: 19000,
    image: "/doble.webp?height=300&width=400",
  },
]

export default function FeaturedProductsSection() {
  return (
    <section className="container mx-auto w-full">
      <h2 className="text-3xl font-bold text-center mb-12">Productos Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{product.description}</p>
              <p className="text-2xl font-bold">${product.price.toLocaleString()}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/productos/${product.id}`}>Ver Detalles</Link>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">Agregar al Carrito</Button>
            </CardFooter>
          </Card>
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
