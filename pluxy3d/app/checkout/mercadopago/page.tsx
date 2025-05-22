"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function CheckoutMercadoPagoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pago con Mercado Pago</h1>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Serás redirigido a Mercado Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg" asChild>
            <Link href="/checkout/mercadopago/success">Ir a Mercado Pago</Link>
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
