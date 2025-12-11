"use client"

import React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Printer,
  Wrench,
  MessageSquare,
  Heart,
  LogOut,
  Settings,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import Image from "next/image"

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const { cartCount } = useCart()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  /**
   * Manejar búsqueda
   * @param {Event} e - Evento del formulario
   */
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Redireccionar a la página de búsqueda
      window.location.href = `/productos?search=${encodeURIComponent(searchQuery)}`
    }
  }

  /**
   * Manejar cierre de sesión
   */
  const handleLogout = () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu" className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px]">
              <div className="flex flex-col gap-6 py-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                  <SheetClose asChild>
                    <span className="text-purple-600">PLUXY 3D</span>
                  </SheetClose>
                </Link>
                <div className="space-y-4">
                  <SheetClose asChild>
                    <Link
                      href="/productos?category=impresoras"
                      className="flex items-center gap-3 py-3 px-2 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    >
                      <Printer className="h-5 w-5" />
                      <span>Impresoras</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/productos?category=componentes"
                      className="flex items-center gap-3 py-3 px-2 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    >
                      <Wrench className="h-5 w-5" />
                      <span>Componentes</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/soporte"
                      className="flex items-center gap-3 py-3 px-2 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span>Soporte Técnico</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/favoritos"
                      className="flex items-center gap-3 py-3 px-2 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    >
                      <Heart className="h-5 w-5" />
                      <span>Favoritos</span>
                    </Link>
                  </SheetClose>
                  {/* Admin link for mobile */}
                  {user && (user.role === "admin" || user.email === "admin@pluxy3d.com") && (
                    <SheetClose asChild>
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 py-3 px-2 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                      >
                        <Settings className="h-5 w-5" />
                        <span>Administración</span>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
            <span className="text-purple-600">PLUXY 3D</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">Impresoras</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/productos?category=impresora"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500 to-purple-700 p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">Impresoras 3D</div>
                          <p className="text-sm leading-tight text-white/90">
                            Explora nuestra selección de impresoras 3D de alta calidad
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/productos?category=impresora&brand=creality" title="Creality">
                      Impresoras 3D de la marca Creality
                    </ListItem>
                    <ListItem href="/productos?category=impresora&brand=hellbot" title="Hellbot">
                      Impresoras 3D de la marca Hellbot
                    </ListItem>
                    <ListItem href="/productos?category=impresora&brand=prusa" title="Prusa">
                      Impresoras 3D de la marca Prusa
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">Componentes</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="/productos?category=componente&search=extrusor" title="Extrusores">
                      Extrusores y kits de mejora
                    </ListItem>
                    <ListItem href="/productos?category=componente&search=hotend" title="HotEnd">
                      HotEnd y componentes térmicos
                    </ListItem>
                    <ListItem href="/productos?category=componente&search=placa" title="Placas de Impresión">
                      Placas de impresión y superficies
                    </ListItem>
                    <ListItem href="/productos?category=componente&search=resorte" title="Resortes">
                      Resortes y componentes mecánicos
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/soporte" className={cn(navigationMenuTriggerStyle(), "text-sm")}>
                    Soporte Técnico
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/personalizacion" className={cn(navigationMenuTriggerStyle(), "text-sm")}>
                    Personalización
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Admin link for desktop */}
              {user && (user.role === "admin" || user.email === "admin@pluxy3d.com") && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/admin" className={cn(navigationMenuTriggerStyle(), "text-sm")}>
                      Administración
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search and User Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search */}
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="w-[200px] md:w-[300px]"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="ghost" size="icon" className="ml-2 shrink-0">
                <Search className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
                className="ml-1 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Buscar"
              onClick={() => setIsSearchOpen(true)}
              className="shrink-0"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}

          {/* Admin Dashboard Link */}
          {user && (user.role === "admin" || user.email === "admin@pluxy3d.com") && (
            <Link href="/admin">
              <Button variant="ghost" size="icon" aria-label="Administración" className="shrink-0" title="Panel de Administración">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          )}

          {/* Cart */}
          <Link href="/carrito">
            <Button variant="ghost" size="icon" aria-label="Carrito" className="relative shrink-0">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-purple-600 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Cuenta" className="relative shrink-0">
                  {user?.avatar ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image src={user.avatar || "/placeholder.svg"} alt={user.name || user.nombre || "Avatar de usuario"} fill className="object-cover" />
                    </div>
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || user?.nombre}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    {user?.role === "admin" && (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 w-fit text-xs">
                        Administrador
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/cuenta" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Mi Cuenta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cuenta?tab=orders" className="cursor-pointer">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Mis Pedidos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favoritos" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    Favoritos
                  </Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Panel de Administración
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon" aria-label="Cuenta" className="shrink-0">
                <User className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef(function ListItem({ className, title, children, ...props }, ref) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
