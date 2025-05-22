"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CheckoutPage() {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Selecciona un método de pago</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className={selectedMethod === "tarjeta" ? "border-purple-600" : ""}>
          <CardHeader>
            <CardTitle>Tarjeta de crédito/débito</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                setSelectedMethod("tarjeta")
                router.push("/checkout/tarjeta")
              }}
              size="lg"
            >
              Pagar con tarjeta
            </Button>
          </CardContent>
        </Card>
        <Card className={selectedMethod === "mercadopago" ? "border-purple-600" : ""}>
          <CardHeader>
            <CardTitle>Mercado Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                setSelectedMethod("mercadopago")
                router.push("/checkout/mercadopago")
              }}
              size="lg"
            >
              Pagar con Mercado Pago
            </Button>
          </CardContent>
        </Card>
      </div>
      <Separator className="my-8" />
      <div className="flex justify-center">
        <Link href="/carrito">
          <Button variant="outline">Volver al carrito</Button>
        </Link>
      </div>
    </div>
  )
}
