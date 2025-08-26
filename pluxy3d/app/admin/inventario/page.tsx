"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const items = [
  { name: 'Creality Ender 3 V2', sku: 'CR-EN3V2-001', loc: 'A1-B2', stock: 15, min: 5, max: 50, updated: '2024-01-25' },
  { name: 'Kit Mejora Ender-3', sku: 'KIT-EN3-001', loc: 'B2-C3', stock: 45, min: 10, max: 100, updated: '2024-01-24' },
  { name: 'Hellbot Magna 2', sku: 'HB-MG2-001', loc: 'A3-D1', stock: 8, min: 3, max: 25, updated: '2024-01-23' },
]

export default function AdminInventarioPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Inventario</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">Control de stock y ubicaciones</p>
        <div className="space-y-3">
          {items.map(i => (
            <div key={i.sku} className="rounded-lg border p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-xs text-muted-foreground">SKU: {i.sku}</div>
                <div className="text-xs text-muted-foreground">Ubicación: {i.loc}</div>
              </div>
              <div className="flex items-end gap-4">
                <Badge className="bg-emerald-100 text-emerald-700">Normal</Badge>
                <div className="text-right text-sm">
                  <div className="font-medium">Stock: {i.stock}</div>
                  <div className="text-muted-foreground">Min: {i.min} | Max: {i.max}</div>
                  <div className="text-muted-foreground">Actualizado: {i.updated}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
