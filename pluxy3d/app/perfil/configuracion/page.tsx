"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function ConfiguracionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="font-medium mb-2">Notificaciones por Email</div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="block">Confirmaciones de pedido</Label>
                <p className="text-sm text-muted-foreground">Recibe emails cuando realices un pedido</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="block">Actualizaciones de envío</Label>
                <p className="text-sm text-muted-foreground">Notificaciones sobre el estado de tus envíos</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="block">Ofertas y promociones</Label>
                <p className="text-sm text-muted-foreground">Recibe ofertas especiales y descuentos</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <div className="font-medium">Seguridad</div>
          <Button variant="outline" className="w-full sm:w-auto">Cambiar Contraseña</Button>
          <Button variant="outline" className="w-full sm:w-auto">Configurar Autenticación de Dos Factores</Button>
        </div>

        <div className="pt-6">
          <div className="text-destructive font-medium mb-2">Zona Peligrosa</div>
          <Button variant="destructive" className="w-full sm:w-auto">Eliminar Cuenta</Button>
          <p className="text-xs text-muted-foreground mt-2">Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.</p>
        </div>
      </CardContent>
    </Card>
  )
}
