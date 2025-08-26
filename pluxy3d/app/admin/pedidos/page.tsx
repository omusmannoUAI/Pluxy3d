"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const orders = [
  { id: 'ORD-001', customer: 'Juan Pérez', email: 'juan@example.com', status: 'Procesando', total: '$389,099', products: 2, date: '2024-01-25' },
  { id: 'ORD-002', customer: 'María García', email: 'maria@example.com', status: 'Enviado', total: '$45,000', products: 1, date: '2024-01-24' },
  { id: 'ORD-003', customer: 'Carlos López', email: 'carlos@example.com', status: 'Entregado', total: '$125,000', products: 3, date: '2024-01-23' },
]

export default function AdminPedidosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">Administra todos los pedidos de la tienda</p>
        <div className="space-y-3">
          {orders.map(o => (
            <div key={o.id} className="rounded-lg border p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{o.id}</div>
                <div className="text-sm text-muted-foreground">{o.customer}</div>
                <div className="text-xs text-muted-foreground">{o.email}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={
                  o.status === 'Procesando' ? 'bg-amber-100 text-amber-700' :
                  o.status === 'Enviado' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                }>{o.status}</Badge>
                <div className="text-right text-sm">
                  <div className="font-medium">{o.total}</div>
                  <div className="text-muted-foreground">{o.products} productos</div>
                  <div className="text-muted-foreground">{o.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
