"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const orders = [
  {
    id: "ORD-001",
    date: "1/14/2024",
    status: { label: "Entregado", color: "bg-emerald-100 text-emerald-700" },
    total: 389099,
    items: ["Kit Mejora Ender-3 ×1", "Impresora Creality Ender-3 V2 ×1"],
  },
  {
    id: "ORD-002",
    date: "1/19/2024",
    status: { label: "Procesando", color: "bg-amber-100 text-amber-700" },
    total: 45000,
    items: ["Filamento PLA 1.75mm ×2"],
  },
  {
    id: "ORD-003",
    date: "1/24/2024",
    status: { label: "Enviado", color: "bg-blue-100 text-blue-700" },
    total: 125000,
    items: ["Kit Doble Tracción ×1", "Placa de Impresión Magnética ×1"],
  },
]

export default function PedidosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">Historial de tus compras</p>
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold">Pedido #{o.id}</div>
                  <div className="text-sm text-muted-foreground">Fecha: {o.date}</div>
                  <ul className="mt-3 text-sm text-muted-foreground list-disc pl-5">
                    {o.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-2"/>Ver Detalles</Button>
                    <Button variant="secondary" size="sm">Volver a Comprar</Button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${o.status.color}`}>{o.status.label}</span>
                  <div className="text-lg font-bold">${o.total.toLocaleString("es-AR")}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
