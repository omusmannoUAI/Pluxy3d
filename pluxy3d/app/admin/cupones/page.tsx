"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TicketPercent } from "lucide-react"

const cupones = [
  { code: "DESCUENTO10", desc: "10% de descuento en toda la tienda", start: "2024-01-01", end: "2024-12-31", used: 45, limit: 100, type: "10%", min: "$50,000" },
  { code: "ENVIOGRATIS", desc: "Envio gratis en compras mayores a $100.000", start: "2024-01-15", end: "2024-06-30", used: 23, limit: 50, type: "Envío Gratis", min: "$100,000" },
  { code: "BIENVENIDA", desc: "Descuento de bienvenida para nuevos usuarios", start: "2024-01-01", end: "2024-12-31", used: 0, limit: 1, type: "$15,000", min: "$0" },
]

export default function AdminCuponesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gestión de Cupones</h2>
        <Button><span className="mr-2">+</span>Nuevo Cupón</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Administra cupones de descuento y promociones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cupones.map(c => (
              <div key={c.code} className="rounded-lg border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <TicketPercent className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">{c.code}</div>
                    <div className="text-sm text-muted-foreground">{c.desc}</div>
                    <div className="text-xs text-muted-foreground">Válido: {c.start} - {c.end}</div>
                    <div className="text-xs text-muted-foreground">Usado: {c.used}/{c.limit}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Activo</Badge>
                  <div className="text-right text-sm">
                    <div className="font-medium">{c.type}</div>
                    <div className="text-muted-foreground">Min: {c.min}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
