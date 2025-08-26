"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tag } from "lucide-react"

const categorias = [
  { name: "Impresoras", desc: "Impresoras 3D de todas las marcas", slug: "impresoras", productos: 45, activa: true },
  { name: "Componentes", desc: "Repuestos y componentes para impresoras 3D", slug: "componentes", productos: 78, activa: true },
  { name: "Filamentos", desc: "Filamentos de diferentes materiales", slug: "filamentos", productos: 23, activa: true },
  { name: "Extrusores", desc: "Extrusores y kits de mejora", slug: "extrusores", productos: 15, activa: true, parent: "Componentes" },
]

export default function AdminCategoriasPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gestión de Categorías</h2>
        <Button><span className="mr-2">+</span>Nueva Categoría</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Organiza los productos en categorías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categorias.map(c => (
              <div key={c.slug} className="rounded-lg border p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-muted-foreground">{c.desc}</div>
                    <div className="text-xs text-muted-foreground">Slug: {c.slug}{c.parent ? ` | Subcategoría de: ${c.parent}` : ""}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{c.activa ? 'Activa' : 'Inactiva'}</Badge>
                  <div className="text-sm text-right text-muted-foreground">{c.productos} productos</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
