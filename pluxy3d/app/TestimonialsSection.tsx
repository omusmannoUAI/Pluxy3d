import { Star } from "lucide-react"

const testimonials = [
  {
    name: "María González",
    role: "Diseñadora Industrial",
    quote: "Excelente servicio y productos de calidad. Mi Ender 3 funciona perfectamente después de 6 meses.",
  },
  {
    name: "Carlos Rodríguez",
    role: "Ingeniero",
    quote: "El soporte técnico es increíble. Me ayudaron a resolver todos mis problemas rápidamente.",
  },
  {
    name: "Ana Martínez",
    role: "Arquitecta",
    quote: "Los componentes de mejora transformaron completamente mi impresora. Muy recomendado.",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="container mx-auto w-full py-10 md:py-12">
      <h2 className="text-3xl font-bold text-center mb-2">Lo que Dicen Nuestros Clientes</h2>
      <p className="text-center text-muted-foreground mb-8 md:mb-10">Miles de clientes satisfechos confían en nosotros para sus proyectos de impresión 3D</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-lg border p-6">
            <div className="mb-3">
              <div className="flex gap-1 text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400" />
                ))}
              </div>
            </div>
            <blockquote className="italic text-muted-foreground">“{t.quote}”</blockquote>
            <div className="mt-4">
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-muted-foreground">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
