import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto prose prose-sm">
        <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
          <p className="text-gray-700 mb-4">
            Bienvenido a PLUXY 3D. Estos Términos y Condiciones rigen el uso de nuestro sitio web y los servicios que
            ofrecemos. Al acceder y utilizar este sitio, aceptas estar vinculado por estos términos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Uso Permitido</h2>
          <p className="text-gray-700 mb-4">
            Te comprometes a utilizar este sitio solo para fines legales y de manera que no infrinja los derechos de
            otros ni restrinja su uso y disfrute. El comportamiento prohibido incluye acosar u ocasionar angustia o
            inconvenientes; transmitir obscenidades u ofensas; interrumpir el flujo normal del diálogo dentro de nuestro
            sitio web.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Limitación de Responsabilidad</h2>
          <p className="text-gray-700 mb-4">
            La información en este sitio se proporciona "tal cual". PLUXY 3D no ofrece garantías expresas o implícitas.
            En la máxima medida permitida por la ley, PLUXY 3D rechaza cualquier responsabilidad por daños derivados del
            uso de este sitio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Cambios a Estos Términos</h2>
          <p className="text-gray-700 mb-4">
            PLUXY 3D se reserva el derecho de modificar estos términos en cualquier momento. Tus continuación del uso
            del sitio después de cualquier cambio constituye tu aceptación de los nuevos términos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Contacto</h2>
          <p className="text-gray-700 mb-4">
            Si tienes preguntas sobre estos Términos, por favor{" "}
            <Link href="/contacto" className="text-purple-600 hover:underline">
              contáctanos
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
