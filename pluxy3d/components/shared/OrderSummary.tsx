"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPriceSimple } from "@/lib/helpers"
import { ShoppingCart, ArrowRight } from "lucide-react"

interface OrderSummaryItem {
  id: string
  name: string
  price: number
  quantity?: number
}

interface OrderSummaryProps {
  items: OrderSummaryItem[]
  subtotal?: number
  discount?: number
  shipping?: number
  total?: number
  onCheckout?: () => void
  checkoutLabel?: string
  showCheckoutButton?: boolean
  className?: string
}

export function OrderSummary({
  items,
  subtotal,
  discount = 0,
  shipping = 0,
  total,
  onCheckout,
  checkoutLabel = "Finalizar Compra",
  showCheckoutButton = true,
  className = ""
}: OrderSummaryProps) {
  const calculatedSubtotal = subtotal ?? items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
  const calculatedTotal = total ?? (calculatedSubtotal - discount + shipping)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Resumen del Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="flex-1">
                {item.name}
                {item.quantity && item.quantity > 1 && (
                  <span className="text-muted-foreground"> x{item.quantity}</span>
                )}
              </span>
              <span>{formatPriceSimple(item.price * (item.quantity || 1))}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPriceSimple(calculatedSubtotal)}</span>
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
            <span>{formatPriceSimple(calculatedTotal)}</span>
          </div>
        </div>

        {showCheckoutButton && (
          <div className="pt-4">
            <Button 
              variant="purple" 
              className="w-full" 
              size="lg" 
              onClick={onCheckout}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {checkoutLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
