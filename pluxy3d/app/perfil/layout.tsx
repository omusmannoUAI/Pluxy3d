"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { CreditCard, MapPin, Package, Settings, User } from "lucide-react"

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) router.replace("/login")
  }, [user, router])

  if (!user) return null

  const items = [
    { href: "/perfil", label: "Mi Perfil", icon: User },
    { href: "/perfil/pedidos", label: "Mis Pedidos", icon: Package },
    { href: "/perfil/direcciones", label: "Direcciones", icon: MapPin },
    { href: "/perfil/metodos-de-pago", label: "Métodos de Pago", icon: CreditCard },
    { href: "/perfil/configuracion", label: "Configuración", icon: Settings },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <aside>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center gap-2 py-4">
                <div className="h-16 w-16 rounded-full bg-muted" />
                <div className="font-semibold">{user.name || "Usuario"}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
              <nav className="space-y-1">
                {items.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} className="block">
                    <Button
                      variant={pathname === href ? "default" : "ghost"}
                      className={cn("w-full justify-start", pathname === href ? "bg-foreground text-background" : "")}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {label}
                    </Button>
                  </Link>
                ))}
              </nav>
              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    logout()
                    router.push("/login")
                  }}
                >
                  Cerrar Sesión
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  )
}
