"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const paginas = [
  { name: "Banner Principal", type: "banner", updated: "2024-01-25", status: "Activo" },
  { name: "Sobre Nosotros", type: "page", updated: "2024-01-20", status: "Activo" },
  { name: "Términos y Condiciones", type: "legal", updated: "2024-01-15", status: "Activo" },
]

export default function AdminContenidoPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Gestión de Contenido</h2>
      <Tabs defaultValue="paginas">
        <TabsList>
          <TabsTrigger value="paginas">Páginas</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>
        <TabsContent value="paginas">
          <Card>
            <CardHeader>
              <CardTitle>Contenido de Páginas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {paginas.map((p, i) => (
                  <div key={i} className="rounded-lg border p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.type}</div>
                      <div className="text-xs text-muted-foreground">Actualizado: {p.updated}</div>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">{p.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="newsletter">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configura campañas, suscriptores y envíos.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Metadatos, sitemap y robots.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
