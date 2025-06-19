import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Printer, Wrench, MessageSquare, ShoppingCart } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section className="container mx-auto w-full">
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
  )
}
