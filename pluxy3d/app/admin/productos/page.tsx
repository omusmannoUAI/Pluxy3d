"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const products = [
  { name: 'Creality Ender 3 V2', category: 'Impresoras', sold: 234, price: '$320,000', stock: 15 },
  { name: 'Kit Mejora Ender-3', category: 'Componentes', sold: 189, price: '$22,750', stock: 45 },
  { name: 'Hellbot Magna 2', category: 'Impresoras', sold: 67, price: '$450,000', stock: 8 },
]

export default function AdminProductosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Productos</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">Administra el catálogo de productos</p>
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.name} className="rounded-lg border p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-muted-foreground">{p.category}</div>
                <div className="text-xs text-muted-foreground">{p.sold} vendidos</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">Stock: {p.stock}</Badge>
                <div className="text-right text-sm">
                  <div className="font-medium">{p.price}</div>
                  <div className="text-muted-foreground">active</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
