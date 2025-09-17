"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  BarChart3, 
  Users, 
  ShoppingBag, 
  Package, 
  Layers, 
  Tags, 
  Percent, 
  Star, 
  MessageCircle, 
  HeadphonesIcon, 
  FileText, 
  Settings,
  Home
} from "lucide-react"

interface SidebarProps {
  isCollapsed?: boolean
}

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/resumen",
    icon: Home,
    color: "text-blue-600"
  },
  {
    name: "Usuarios", 
    href: "/admin/usuarios",
    icon: Users,
    color: "text-purple-600"
  },
  {
    name: "Pedidos",
    href: "/admin/pedidos", 
    icon: ShoppingBag,
    color: "text-green-600"
  },
  {
    name: "Productos",
    href: "/admin/productos",
    icon: Package,
    color: "text-orange-600"
  },
  {
    name: "Inventario",
    href: "/admin/inventario",
    icon: Layers,
    color: "text-teal-600"
  },
  {
    name: "Categorías", 
    href: "/admin/categorias",
    icon: Tags,
    color: "text-red-600"
  },
  {
    name: "Cupones",
    href: "/admin/cupones",
    icon: Percent,
    color: "text-yellow-600"
  },
  {
    name: "Reseñas",
    href: "/admin/resenas", 
    icon: Star,
    color: "text-amber-600"
  },
  {
    name: "Mensajes",
    href: "/admin/mensajes",
    icon: MessageCircle,
    color: "text-blue-600"
  },
  {
    name: "Soporte",
    href: "/admin/soporte",
    icon: HeadphonesIcon,
    color: "text-green-600"
  },
  {
    name: "Contenido",
    href: "/admin/contenido", 
    icon: FileText,
    color: "text-purple-600"
  },
  {
    name: "Analíticas",
    href: "/admin/analiticas",
    icon: BarChart3,
    color: "text-indigo-600"
  },
  {
    name: "Configuración",
    href: "/admin/config",
    icon: Settings,
    color: "text-gray-600"
  }
]

export function AdminSidebar({ isCollapsed = false }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P3D</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Pluxy3D Admin
                </span>
              </div>
            </>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">P3D</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                )}
              >
                <Icon className={cn(
                  "flex-shrink-0 w-5 h-5",
                  isActive ? "text-blue-600" : item.color,
                  !isCollapsed && "mr-3"
                )} />
                {!isCollapsed && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  Administrador
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  admin@pluxy3d.com
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}