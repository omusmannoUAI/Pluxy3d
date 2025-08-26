import { Truck, ShieldCheck, Headphones } from "lucide-react"

const items = [
  { icon: Truck, title: "Envío Gratis", desc: "En compras superiores a $100.000" },
  { icon: ShieldCheck, title: "Garantía Extendida", desc: "12 meses de garantía en todos los productos" },
  { icon: Headphones, title: "Soporte 24/7", desc: "Asistencia técnica especializada" },
]

export default function BenefitsStrip() {
  return (
    <section className="w-full bg-muted/40">
      <div className="container mx-auto px-4 py-8 md:py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <Icon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="font-semibold text-lg">{title}</div>
            <div className="text-sm text-muted-foreground">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
