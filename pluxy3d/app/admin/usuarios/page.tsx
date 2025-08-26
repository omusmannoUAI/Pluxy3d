"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const users = [
  { name: "Juan Pérez", email: "juan@example.com", since: "2023-06-15", status: "Activo", orders: 5, spent: "$1,250,000" },
  { name: "María García", email: "maria@example.com", since: "2023-03-22", status: "Activo", orders: 12, spent: "$2,890,000" },
  { name: "Carlos López", email: "carlos@example.com", since: "2023-11-08", status: "Inactivo", orders: 2, spent: "$450,000" },
]

export default function AdminUsuariosPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">Administra los usuarios registrados en la plataforma</p>
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.email} className="rounded-lg border p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-sm text-muted-foreground">{u.email}</div>
                  <div className="text-xs text-muted-foreground">Miembro desde: {u.since}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className={u.status === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted'}>{u.status}</Badge>
                <Badge variant="outline">customer</Badge>
                <div className="text-right text-sm">
                  <div className="font-medium">{u.orders} pedidos</div>
                  <div className="text-muted-foreground">{u.spent}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
