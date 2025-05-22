"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function CheckoutTarjetaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pago con tarjeta</h1>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Ingresa los datos de tu tarjeta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Nombre en la tarjeta" className="bg-white" />
          <Input placeholder="Número de tarjeta" className="bg-white" maxLength={19} />
          <div className="flex gap-4">
            <Input placeholder="MM/AA" className="bg-white" maxLength={5} />
            <Input placeholder="CVV" className="bg-white" maxLength={4} />
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg" asChild>
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
