import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Printer, Wrench, MessageSquare, ShoppingCart } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Bienvenido a Pluxy 3D</h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground">
              Tu tienda especializada en impresoras 3D, componentes y servicio técnico. Encuentra todo lo que necesitas
              para tus proyectos de impresión 3D.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/productos">Ver Productos</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/soporte">Soporte Técnico</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px]">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Impresora 3D"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nuestros Servicios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Printer className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Impresoras 3D</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Amplio catálogo de impresoras 3D de las mejores marcas del mercado.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="text-purple-600" asChild>
                <Link href="/productos/impresoras">
                  Ver más <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Wrench className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Componentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Repuestos y accesorios para mejorar y mantener tu impresora 3D.</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="text-purple-600" asChild>
                <Link href="/productos/componentes">
                  Ver más <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Soporte Técnico</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sistema de tickets y asistente IA para resolver tus problemas técnicos.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="text-purple-600" asChild>
                <Link href="/soporte">
                  Ver más <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Personalización</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Personaliza tu impresora 3D con nuestros servicios de customización.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="text-purple-600" asChild>
                <Link href="/personalizacion">
                  Ver más <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16">
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
    </div>
  )
}

const featuredProducts = [
  {
    id: 1,
    name: "Creality Ender 3 V2",
    description: "Impresora 3D de alta calidad para principiantes y profesionales.",
    price: 320000,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 2,
    name: "Kit Mejora Ender-3",
    description: "Kit de mejora para tu impresora Ender 3 con extrusor, teflón y resortes.",
    price: 22750,
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 3,
    name: "Kit Doble Tracción",
    description: "Sistema de doble tracción para mejorar la precisión de tus impresiones.",
    price: 19000,
    image: "/placeholder.svg?height=300&width=400",
  },
]
