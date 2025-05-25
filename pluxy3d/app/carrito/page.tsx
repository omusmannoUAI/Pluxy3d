"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { apiFetch } from "@/lib/api"

interface CartItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  quantity: number
  discount?: {
    percentage: number
    originalPrice: number
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    apiFetch("/carrito")
      .then((data) => setCartItems(data as CartItem[]))
      .catch(console.error)
  }, [])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const discount = cartItems.reduce(
    (total, item) => total + (item.discount ? (item.discount.originalPrice - item.price) * item.quantity : 0),
    0,
  )

  const shipping: number = 0 // Free shipping
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-8">Parece que aún no has agregado productos a tu carrito.</p>
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/productos">Explorar Productos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Productos ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative w-full sm:w-24 h-24">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-grow space-y-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center">
                          {item.discount && (
                            <span className="text-sm line-through text-muted-foreground mr-2">
                              ${item.discount.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="font-bold">${item.price.toString()}</span>
                          {item.discount && (
                            <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                              -{item.discount.percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/productos">Seguir Comprando</Link>
                </Button>
                <Button variant="destructive" onClick={() => setCartItems([])}>
                  Vaciar Carrito
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-${discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{shipping === 0 ? "Gratis" : `$${shipping.toLocaleString()}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>

                <div className="pt-4">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg" asChild>
                    <Link href="/checkout">
                      Finalizar Compra <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-muted-foreground text-center">Aceptamos múltiples métodos de pago</p>
                  <div className="flex justify-center gap-4 mt-2 items-center">
                    <Image src="/visa.png" alt="Visa" width={48} height={32} style={{ objectFit: "contain" }} />
                    <Image
                      src="/mastercard.png"
                      alt="MasterCard"
                      width={48}
                      height={32}
                      style={{ objectFit: "contain" }}
                    />
                    <Image src="/mercadopago.png" alt="Mercado Pago" width={60} height={32} style={{ objectFit: "contain" }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Input placeholder="Código de descuento" />
                    <Button variant="outline">Aplicar</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
