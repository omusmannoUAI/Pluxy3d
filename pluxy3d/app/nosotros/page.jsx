import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Users, Target, Award } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-4">Sobre PLUXY 3D</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Somos líderes en el suministro de impresoras 3D y componentes
        </p>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Nuestra Historia</h2>
              <p className="text-gray-700 mb-4">
                Desde 2020, PLUXY 3D se ha comprometido a proporcionar la tecnología de impresión 3D más accesible y de
                alta calidad a clientes en toda la región.
              </p>
              <p className="text-gray-700 mb-4">
                Creemos que la impresión 3D es el futuro de la fabricación y queremos que todos tengan acceso a estas
                herramientas increíbles.
              </p>
              <p className="text-gray-700">
                Nuestro equipo de expertos está dedicado a proporcionar el mejor servicio técnico y soporte a nuestros
                clientes.
              </p>
            </div>
            <div className="relative aspect-square">
              <Image src="/images/hero-printer-1.jpg" alt="PLUXY 3D" fill className="object-cover rounded-lg" />
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Enfoque en el Cliente</h3>
                <p className="text-gray-700">Priorizamos la satisfacción del cliente y la excelencia en el servicio</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Innovación</h3>
                <p className="text-gray-700">Buscamos continuamente las mejores soluciones y tecnologías nuevas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Calidad</h3>
                <p className="text-gray-700">Solo ofrecemos productos de la más alta calidad y confiabilidad</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-16 bg-purple-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-8 text-center">¿Preguntas?</h2>
          <div className="text-center">
            <p className="text-gray-700 mb-4">¿Te gustaría conocer más sobre PLUXY 3D?</p>
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href="/contacto">Contacta con Nosotros</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
