"use client"

import { useEffect, useState } from "react"
import { 
  Search, 
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getContentPages } from "@/services/api"

export default function ContentPage() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    setLoading(true)
    try {
      const data = await getContentPages()
      setPages(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setPages([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Soporte</h1>
          <p className="text-muted-foreground">Gestión de Contenido</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-8 w-64" />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">4</div>
            <span className="sr-only">Notificaciones</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </Button>
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            A
          </div>
        </div>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="paginas" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="paginas">Páginas</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paginas">
            <h2 className="text-xl font-bold mb-6">Contenido de Páginas</h2>
            
            <div className="space-y-4">
              {pages.map((page) => (
                <div key={page.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">{page.type}</p>
                    <p className="text-xs text-muted-foreground mt-1">Actualizado: {page.updated}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                      {page.status === "Active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="newsletter">
            <div className="p-4 text-center text-muted-foreground">
              Gestión de Newsletter (Próximamente)
            </div>
          </TabsContent>
          
          <TabsContent value="seo">
            <div className="p-4 text-center text-muted-foreground">
              Configuración SEO (Próximamente)
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
