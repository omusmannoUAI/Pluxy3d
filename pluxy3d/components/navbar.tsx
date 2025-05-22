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
import { cn } from "@/lib/utils"
import { Search, ShoppingCart, User, Menu, X, Printer, Wrench, MessageSquare, Heart } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const cartItemCount = 2 // This would come from your cart state

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <div className="flex flex-col gap-6 py-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl" passHref>
                  <SheetClose asChild>
                    <span className="text-purple-600">PLUXY 3D</span>
                  </SheetClose>
                </Link>
                <div className="space-y-4">
                  <SheetClose asChild>
                    <Link href="/productos/impresoras" className="flex items-center gap-2 py-2 hover:text-purple-600">
                      <Printer className="h-5 w-5" />
                      <span>Impresoras</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/productos/componentes" className="flex items-center gap-2 py-2 hover:text-purple-600">
                      <Wrench className="h-5 w-5" />
                      <span>Componentes</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/soporte" className="flex items-center gap-2 py-2 hover:text-purple-600">
                      <MessageSquare className="h-5 w-5" />
                      <span>Soporte Técnico</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/favoritos" className="flex items-center gap-2 py-2 hover:text-purple-600">
                      <Heart className="h-5 w-5" />
                      <span>Favoritos</span>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="hidden md:flex items-center gap-2 font-bold text-xl">
            <span className="text-purple-600">PLUXY 3D</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Impresoras</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/productos/impresoras"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500 to-purple-700 p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">Impresoras 3D</div>
                          <p className="text-sm leading-tight text-white/90">
                            Explora nuestra selección de impresoras 3D de alta calidad
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/productos/impresoras/creality" title="Creality">
                      Impresoras 3D de la marca Creality
                    </ListItem>
                    <ListItem href="/productos/impresoras/hellbot" title="Hellbot">
                      Impresoras 3D de la marca Hellbot
                    </ListItem>
                    <ListItem href="/productos/impresoras/prusa" title="Prusa">
                      Impresoras 3D de la marca Prusa
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Componentes</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="/productos/componentes/extrusores" title="Extrusores">
                      Extrusores y kits de mejora
                    </ListItem>
                    <ListItem href="/productos/componentes/hotend" title="HotEnd">
                      HotEnd y componentes térmicos
                    </ListItem>
                    <ListItem href="/productos/componentes/placas" title="Placas de Impresión">
                      Placas de impresión y superficies
                    </ListItem>
                    <ListItem href="/productos/componentes/resortes" title="Resortes">
                      Resortes y componentes mecánicos
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/soporte" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Soporte Técnico</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/personalizacion" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Personalización</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search and User Actions */}
        <div className="flex items-center gap-4">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input type="search" placeholder="Buscar productos..." className="w-[200px] md:w-[300px]" autoFocus />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="ml-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" aria-label="Buscar" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
          )}

          <div className="relative">
            <Link href="/carrito">
              <Button variant="ghost" size="icon" aria-label="Carrito">
                <ShoppingCart className="h-5 w-5" />
              </Button>
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-purple-600">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </div>

          <Link href="/login">
            <Button variant="ghost" size="icon" aria-label="Cuenta">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
