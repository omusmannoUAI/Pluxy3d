import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between py-12 md:py-20 gap-8 md:gap-0 container mx-auto w-full">
      <div className="flex-1">
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
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="relative w-full max-w-[400px] aspect-square">
          <img src="/hellbot.png" alt="Hellbot" style={{ objectFit: "contain", width: "100%", height: "100%" }} />
        </div>
      </div>
    </section>
  )
}
