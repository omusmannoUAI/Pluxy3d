"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FormField } from "@/components/shared/FormFields"
import Link from "next/link"

export default function CheckoutTarjetaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pago con tarjeta</h1>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Ingresa los datos de tu tarjeta</CardTitle>
        </CardHeader>        <CardContent className="space-y-4">
          <FormField
            id="cardName"
            label="Nombre en la tarjeta"
            placeholder="Nombre completo"
            required
          />
          <FormField
            id="cardNumber"
            label="Número de tarjeta"
            placeholder="1234 5678 9012 3456"
            required
          />
          <div className="flex gap-4">
            <FormField
              id="expiry"
              label="Vencimiento"
              placeholder="MM/AA"
              required
            />
            <FormField
              id="cvv"
              label="CVV"
              placeholder="123"
              required
            />
          </div>
          <Button variant="purple" className="w-full" size="lg" asChild>
            <Link href="/checkout/tarjeta/success">Pagar</Link>
          </Button>
          <Separator />
          <Link href="/checkout">
            <Button variant="outline" className="w-full mt-2">Volver</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
