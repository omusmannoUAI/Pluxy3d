"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Trash2, Plus, Minus, ArrowRight, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/CartContext"

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart()
  
  /**
   * @type {[boolean, Function]} estado de carga
   */
  const [loading, setLoading] = useState(true)

  /**
   * @type {[string|null, Function]} mensaje de error
   */
  const [error, setError] = useState(null)

  /**
   * @type {[string, Function]} código de cupón
   */
  const [couponCode, setCouponCode] = useState("")

  /**
   * @type {[boolean, Function]} si el cupón está aplicado
   */
  const [couponApplied, setCouponApplied] = useState(false)

  /**
   * @type {[number, Function]} descuento del cupón
   */
  const [couponDiscount, setCouponDiscount] = useState(0)

  // Simular carga inicial para consistencia visual
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  /**
   * Aplicar cupón de descuento
   */
  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    try {
      // Simulamos la aplicación del cupón
      setTimeout(() => {
        // Simulamos un descuento del 10%
        setCouponApplied(true)
        setCouponDiscount(Math.round(cartTotal * 0.1))
      }, 500)
    } catch (err) {
      console.error("Error al aplicar el cupón:", err)
      // Mostrar mensaje de error
    }
  }

  const subtotal = cartTotal
  const discount = 0 // Por ahora no manejamos descuentos individuales en el contexto
  const shipping = 0 // Free shipping
  const total = subtotal + shipping - couponDiscount

  if (loading) {
    return <CartSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link href="/productos">Explorar Productos</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>

      {cart.length === 0 ? (
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
                <CardTitle>Productos ({cart.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative w-full sm:w-24 h-24">
                        <Image src={item.imageUrl || item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-grow space-y-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="flex items-center">
                          {item.originalPrice > item.price && (
                            <span className="text-sm line-through text-muted-foreground mr-2">
                              ${item.originalPrice.toLocaleString("es-AR")}
                            </span>
                          )}
                          <span className="font-bold">${item.price.toLocaleString("es-AR")}</span>
                          {item.originalPrice > item.price && (
                            <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                              -{Math.round((1 - item.price / item.originalPrice) * 100)}%
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
                          onClick={() => removeFromCart(item.id)}
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
                <Button variant="destructive" onClick={clearCart}>
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
                  <span>${subtotal.toLocaleString("es-AR")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-${discount.toLocaleString("es-AR")}</span>
                  </div>
                )}
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Cupón aplicado</span>
                    <span>-${couponDiscount.toLocaleString("es-AR")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{shipping === 0 ? "Gratis" : `$${shipping.toLocaleString("es-AR")}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toLocaleString("es-AR")}</span>
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
                  <div className="flex justify-center gap-2 mt-2">
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Input
                      placeholder="Código de descuento"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={applyCoupon} disabled={couponApplied}>
                      Aplicar
                    </Button>
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

/**
 * Componente de esqueleto para la carga del carrito
 */
function CartSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-48 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              {Array(2)
                .fill()
                .map((_, i) => (
                  <div key={i}>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Skeleton className="w-full sm:w-24 h-24" />
                      <div className="flex-grow space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                    <Separator className="my-4" />
                  </div>
                ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Separator />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>

              <div className="pt-4">
                <Skeleton className="h-12 w-full" />
              </div>

              <div className="pt-4">
                <Skeleton className="h-4 w-full mx-auto" />
              </div>

              <div className="pt-4">
                <div className="flex justify-center gap-2 mt-2">
                  <Skeleton className="w-10 h-6 rounded" />
                  <Skeleton className="w-10 h-6 rounded" />
                  <Skeleton className="w-10 h-6 rounded" />
                  <Skeleton className="w-10 h-6 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 flex-grow" />
                  <Skeleton className="h-10 w-20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
