import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">PLUXY 3D</h3>
            <p className="text-muted-foreground mb-4">
              Tu tienda especializada en impresoras 3D, componentes y servicio técnico.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-purple-600">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-purple-600">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-purple-600">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-purple-600">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Productos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/productos/impresoras" className="text-muted-foreground hover:text-purple-600">
                  Impresoras 3D
                </Link>
              </li>
              <li>
                <Link href="/productos/componentes" className="text-muted-foreground hover:text-purple-600">
                  Componentes
                </Link>
              </li>
              <li>
                <Link href="/productos/filamentos" className="text-muted-foreground hover:text-purple-600">
                  Filamentos
                </Link>
              </li>
              <li>
                <Link href="/productos/accesorios" className="text-muted-foreground hover:text-purple-600">
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/soporte" className="text-muted-foreground hover:text-purple-600">
                  Soporte Técnico
                </Link>
              </li>
              <li>
                <Link href="/personalizacion" className="text-muted-foreground hover:text-purple-600">
                  Personalización
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-muted-foreground hover:text-purple-600">
                  Estado de Impresoras
                </Link>
              </li>
              <li>
                <Link href="/asistente" className="text-muted-foreground hover:text-purple-600">
                  Asistente IA
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nosotros" className="text-muted-foreground hover:text-purple-600">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-purple-600">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-muted-foreground hover:text-purple-600">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-muted-foreground hover:text-purple-600">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pluxy 3D. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
