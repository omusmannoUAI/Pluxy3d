"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { AdminHeader } from "@/components/admin/AdminHeader"

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  resumen: { title: "Dashboard", subtitle: "Resumen general de tu tienda" },
  usuarios: { title: "Usuarios", subtitle: "Gestiona usuarios registrados en la plataforma" },
  pedidos: { title: "Pedidos", subtitle: "Gestiona pedidos" },
  productos: { title: "Productos" },
  inventario: { title: "Inventario" },
  categorias: { title: "Categorías" },
  cupones: { title: "Cupones" },
  resenas: { title: "Reseñas" },
  mensajes: { title: "Mensajes" },
  soporte: { title: "Soporte" },
  contenido: { title: "Contenido" },
  config: { title: "Configuración" },
  analiticas: { title: "Analíticas" },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (!user) router.replace("/login")
    else if (user.role !== 'admin') router.replace("/")
  }, [user, router])

  if (!user || user.role !== 'admin') return null

  // Get current page from URL
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
  const activeSlug = currentPath.split("/").pop() || "resumen"
  const pageInfo = pageTitles[activeSlug] || { title: "Dashboard" }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar isCollapsed={sidebarCollapsed} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
