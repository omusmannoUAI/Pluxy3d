import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto prose prose-sm">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
          <p className="text-gray-700 mb-4">
            PLUXY 3D respeta tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y
            salvaguardamos tu información cuando visitas nuestro sitio web.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Información que Recopilamos</h2>
          <p className="text-gray-700 mb-4">
            Podemos recopilar información sobre ti de varias formas, incluyendo información que proporcionas
            voluntariamente, información recopilada automáticamente y información de terceros.
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Nombre, correo electrónico y dirección</li>
            <li>Información de pago</li>
            <li>Información de navegación y uso del sitio</li>
            <li>Cookies e identificadores similares</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Cómo Usamos Tu Información</h2>
          <p className="text-gray-700 mb-4">Utilizamos la información que recopilamos para:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Procesar tus pedidos</li>
            <li>Mejorar nuestros servicios</li>
            <li>Comunicarnos contigo</li>
            <li>Personalizar tu experiencia</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Tus Derechos</h2>
          <p className="text-gray-700 mb-4">
            Tienes derecho a acceder, actualizar o eliminar tu información personal en cualquier momento. Para ejercer
            estos derechos, por favor{" "}
            <Link href="/contacto" className="text-purple-600 hover:underline">
              contáctanos
            </Link>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Cambios a Esta Política</h2>
          <p className="text-gray-700 mb-4">
            PLUXY 3D puede actualizar esta política de privacidad de vez en cuando. Te notificaremos de cualquier cambio
            publicando la nueva Política de Privacidad en este sitio.
          </p>
        </section>
      </div>
    </div>
  )
}
