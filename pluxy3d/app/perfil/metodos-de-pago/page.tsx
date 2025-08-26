"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Plus } from "lucide-react"

export default function MetodosDePagoPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos de Pago</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">Gestiona tus tarjetas y métodos de pago</p>
        <div className="flex items-center justify-between mb-6">
          <div />
          <Button variant="secondary"><Plus className="h-4 w-4 mr-2"/>Agregar Tarjeta</Button>
        </div>
        <div className="border rounded-lg p-12 flex flex-col items-center justify-center text-center text-muted-foreground">
          <CreditCard className="h-10 w-10 mb-3 opacity-70"/>
          <div>No tienes métodos de pago guardados</div>
          <Button className="mt-4" variant="purple"><Plus className="h-4 w-4 mr-2"/>Agregar Primera Tarjeta</Button>
        </div>
      </CardContent>
    </Card>
  )
}
