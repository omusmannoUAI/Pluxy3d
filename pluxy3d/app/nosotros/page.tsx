import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Award, Wrench, Headset, Truck, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Nosotros | Pluxy 3D",
  description: "Conocé Pluxy 3D: tienda y servicio técnico de impresoras 3D, repuestos y mejoras. Misión, valores, equipo y cómo trabajamos.",
}

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD Organization schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Pluxy 3D",
            url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
            logo: "/placeholder-logo.png",
            sameAs: [
              // Add real profiles when available
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto px-4 py-10 sm:py-14">
          <nav className="mb-6 text-sm text-muted-foreground">
            <Link href="/">Inicio</Link> <span className="mx-1">/</span>
            <span className="text-foreground">Nosotros</span>
          </nav>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <Badge variant="secondary" className="mb-3">Sobre la empresa</Badge>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Construimos mejores experiencias de impresión 3D</h1>
              <p className="mt-3 text-muted-foreground">
                En Pluxy 3D nos enfocamos en ayudarte a elegir, mantener y mejorar tu impresora 3D.
                Ofrecemos repuestos, upgrades y servicio técnico especializado para que imprimas sin fricciones.
              </p>
              <div className="mt-5 flex gap-3">
                <Button asChild>
                  <Link href="/productos">Ver productos</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contacto">Contactarnos</Link>
                </Button>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                <Image src="/hellbot.png" alt="Pluxy 3D" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores y diferenciales */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold">Por qué elegir Pluxy 3D</h2>
          <p className="mt-2 text-muted-foreground">Acompañamos todo el ciclo: compra, instalación, mantenimiento y mejoras.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-purple-600" />
                <CardTitle>Servicio técnico certificado</CardTitle>
              </div>
              <CardDescription>Diagnóstico, reparación y calibración con repuestos originales.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                <CardTitle>Selección curada</CardTitle>
              </div>
              <CardDescription>Productos probados, repuestos compatibles y upgrades recomendados.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Headset className="h-5 w-5 text-purple-600" />
                <CardTitle>Acompañamiento experto</CardTitle>
              </div>
              <CardDescription>Soporte cercano para que resuelvas rápido y sigas imprimiendo.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" />
                <CardTitle>Envíos ágiles</CardTitle>
              </div>
              <CardDescription>Logística pensada para que los repuestos lleguen cuando los necesitás.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <CardTitle>Compras seguras</CardTitle>
              </div>
              <CardDescription>Métodos de pago confiables y políticas claras.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-purple-600" />
                <CardTitle>Experiencia real en 3D</CardTitle>
              </div>
              <CardDescription>Probamos lo que vendemos y compartimos mejores prácticas.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Timeline simple */}
      <section className="bg-muted/40">
        <div className="container mx-auto px-4 py-12">
          <h2 className="mb-6 text-center text-2xl font-semibold">Cómo trabajamos</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <Badge variant="outline" className="w-fit">1</Badge>
                <CardTitle>Diagnóstico</CardTitle>
                <CardDescription>Escuchamos tu caso, evaluamos el equipo y definimos el plan.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Badge variant="outline" className="w-fit">2</Badge>
                <CardTitle>Intervención</CardTitle>
                <CardDescription>Reparación, calibración o upgrade con repuestos compatibles.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Badge variant="outline" className="w-fit">3</Badge>
                <CardTitle>Pruebas y entrega</CardTitle>
                <CardDescription>Testeos con filamento y recomendaciones para continuidad.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold">Nuestro equipo</h2>
          <p className="mt-2 text-muted-foreground">Pequeño y apasionado por el mundo 3D.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-muted">
                    <Image src="/placeholder-user.jpg" alt="Integrante del equipo" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">Miembro {i}</div>
                    <div className="text-sm text-muted-foreground">Especialista en impresión 3D</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-t from-background to-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-between gap-4 rounded-lg border p-6 text-center md:flex-row md:text-left">
            <div>
              <h3 className="text-xl font-semibold">¿Tenés una consulta o necesitás asistencia?</h3>
              <p className="text-muted-foreground">Escribinos y te ayudamos a elegir, reparar o mejorar tu impresora.</p>
            </div>
            <Button asChild>
              <Link href="/contacto">Ir a Contacto</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
