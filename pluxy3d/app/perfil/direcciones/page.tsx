"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MapPin } from "lucide-react"

export default function DireccionesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Direcciones</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">Gestiona tus direcciones de envío</p>
        <div className="flex items-center justify-between mb-6">
          <div />
          <Button variant="secondary"><Plus className="h-4 w-4 mr-2"/>Agregar Dirección</Button>
        </div>
        <div className="border rounded-lg p-12 flex flex-col items-center justify-center text-center text-muted-foreground">
          <MapPin className="h-10 w-10 mb-3 opacity-70"/>
          <div>No tienes direcciones guardadas</div>
          <Button className="mt-4" variant="purple"><Plus className="h-4 w-4 mr-2"/>Agregar Primera Dirección</Button>
        </div>
      </CardContent>
    </Card>
  )
}
