"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sections = [
  { slug: "resumen", label: "Resumen" },
  { slug: "usuarios", label: "Usuarios" },
  { slug: "pedidos", label: "Pedidos" },
  { slug: "productos", label: "Productos" },
  { slug: "inventario", label: "Inventario" },
  { slug: "categorias", label: "Categorías" },
  { slug: "cupones", label: "Cupones" },
  { slug: "resenas", label: "Reseñas" },
  { slug: "mensajes", label: "Mensajes" },
  { slug: "soporte", label: "Soporte" },
  { slug: "contenido", label: "Contenido" },
  { slug: "config", label: "Config" },
  { slug: "analiticas", label: "Analíticas" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) router.replace("/login")
    else if (user.role !== 'admin') router.replace("/")
  }, [user, router])

  if (!user || user.role !== 'admin') return null

  const activeSlug = pathname?.split("/").pop() || "resumen"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Panel de Administración</h1>
          <p className="text-sm text-muted-foreground">Bienvenido, {user.name || 'Admin User'}</p>
        </div>
        <Badge variant="secondary">Administrador</Badge>
      </div>
      <Tabs value={activeSlug} className="mb-6">
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12">
          {sections.map(s => (
            <TabsTrigger key={s.slug} value={s.slug} asChild>
              <Link href={`/admin/${s.slug}`}>{s.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {children}
    </div>
  )
}
