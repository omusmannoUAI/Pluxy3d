"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const tickets = [
  { id: "TKT-001", prioridad: "Alta", titulo: "Problemas con Ender 3", nombre: "Juan Pérez", email: "juan@example.com", creado: "2024-01-25", actualizado: "2024-01-25", asignado: "Soporte Técnico", estado: "Abierto", detalle: "La impresora empieza a sacar las impresiones movidas hacia un lado." },
  { id: "TKT-002", prioridad: "Media", titulo: "Consulta sobre garantía", nombre: "María García", email: "maria@example.com", creado: "2024-01-24", actualizado: "2024-01-24", asignado: "Atención al Cliente", estado: "En Proceso", detalle: "Quiero saber si mi producto tiene garantía después de 6 meses." },
  { id: "TKT-003", prioridad: "Baja", titulo: "Problema con el pedido", nombre: "Carlos López", email: "carlos@example.com", creado: "2024-01-23", actualizado: "2024-01-23", asignado: "Ventas", estado: "Resuelto", detalle: "No recibí el producto completo en mi pedido." },
]

export default function AdminSoportePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gestión de Soporte</h2>
        <Button><span className="mr-2">+</span>Nuevo Ticket</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Administra tickets de soporte técnico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.map(t => (
              <div key={t.id} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{t.id} <span className="ml-2">{t.titulo}</span></div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={t.prioridad === 'Alta' ? 'bg-red-100 text-red-700' : t.prioridad === 'Media' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}>{t.prioridad}</Badge>
                    <Badge variant="outline">{t.estado}</Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{t.nombre} ({t.email})</div>
                <p className="text-sm mt-2">{t.detalle}</p>
                <div className="text-xs text-muted-foreground mt-2">Creado: {t.creado}   Actualizado: {t.actualizado}   Asignado a: {t.asignado}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
