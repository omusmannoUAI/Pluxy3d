"use client"

import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  ClipboardList,
  Tags,
  Ticket,
  Star,
  LifeBuoy,
  FileText,
  BarChart3,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Usuarios",
    url: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Pedidos",
    url: "/admin/pedidos",
    icon: ShoppingBag,
  },
  {
    title: "Productos",
    url: "/admin/productos",
    icon: Package,
  },
  {
    title: "Inventario",
    url: "/admin/inventario",
    icon: ClipboardList,
  },
  {
    title: "Categorías",
    url: "/admin/categorias",
    icon: Tags,
  },
  {
    title: "Cupones",
    url: "/admin/cupones",
    icon: Ticket,
  },
  {
    title: "Reseñas",
    url: "/admin/resenas",
    icon: Star,
  },
  {
    title: "Soporte",
    url: "/admin/soporte",
    icon: LifeBuoy,
  },
  {
    title: "Contenido",
    url: "/admin/contenido",
    icon: FileText,
  },
  {
    title: "Analíticas",
    url: "/admin/analiticas",
    icon: BarChart3,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Pluxy 3D</span>
            <span className="truncate text-xs">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
