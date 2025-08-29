"use client"

import { useEffect, useState } from "react"
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Input, Separator } from "@/components/ui"
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PaymentMethodsDisplay } from "@/components/shared/PaymentMethods"
import { formatPriceSimple } from "@/lib/helpers"
import { useCart } from "@/contexts/CartContext"

export default function CartPage() {
  const {
    items: cartItems,
    loading,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice
  } = useCart()

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const discount = cartItems.reduce(
    (total, item) => total + (item.discount ? (item.discount.originalPrice - item.price) * item.quantity : 0),
    0,
  )
  const shipping: number = 0 // Free shipping
  const total = subtotal + shipping

  const handleUpdateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = async (id: number) => {
    await removeFromCart(id)
  }

  const handleClearCart = async () => {
    await clearCart()
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Cargando carrito...</p>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-8">Parece que aún no has agregado productos a tu carrito.</p>
          <Button asChild size="lg" variant="purple">
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
                        <p className="text-sm text-muted-foreground">{item.description}</p>                        <div className="flex items-center">
                          {item.discount && (
                            <span className="text-sm line-through text-muted-foreground mr-2">
                              {formatPriceSimple(item.discount.originalPrice)}
                            </span>
                          )}
                          <span className="font-bold">{formatPriceSimple(item.price)}</span>
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
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-none"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item.id)}
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
                </Button>                <Button variant="destructive" onClick={handleClearCart}>
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
              <CardContent className="space-y-4">                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPriceSimple(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-{formatPriceSimple(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{shipping === 0 ? "Gratis" : formatPriceSimple(shipping)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPriceSimple(total)}</span>
                </div>

                <div className="pt-4">
                  <Button className="w-full" variant="purple" size="lg" asChild>
                    <Link href="/checkout">
                      Finalizar Compra <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>                <div className="pt-4">
                  <PaymentMethodsDisplay />
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
