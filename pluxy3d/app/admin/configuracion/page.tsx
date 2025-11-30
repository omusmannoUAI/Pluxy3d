"use client"

import { useEffect, useState } from "react"
import { 
  Save,
  Store,
  CreditCard,
  Truck,
  Mail,
  Bell,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { getSettings } from "@/services/api"

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const data = await getSettings()
      setSettings(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !settings) {
    return <div className="p-8 text-center">Cargando configuración...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">Administra la configuración de tu tienda</p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="shipping">Envíos</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información de la Tienda</CardTitle>
              <CardDescription>
                Configura los detalles básicos de tu tienda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="storeName">Nombre de la Tienda</Label>
                <Input id="storeName" defaultValue={settings.storeName} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="storeEmail">Email de Contacto</Label>
                <Input id="storeEmail" defaultValue={settings.storeEmail} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="storeDescription">Descripción</Label>
                <Textarea id="storeDescription" defaultValue={settings.storeDescription} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Moneda y Región</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Input id="currency" defaultValue={settings.currency} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Input id="timezone" defaultValue={settings.timezone} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pago</CardTitle>
              <CardDescription>Activa o desactiva los métodos de pago disponibles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Tarjeta de Crédito/Débito</p>
                    <p className="text-sm text-muted-foreground">Procesado por Stripe</p>
                  </div>
                </div>
                <Switch defaultChecked={settings.paymentMethods.stripe} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-muted-foreground">Pagos seguros con PayPal</p>
                  </div>
                </div>
                <Switch defaultChecked={settings.paymentMethods.paypal} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Envíos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Truck className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Envío Gratuito</p>
                    <p className="text-sm text-muted-foreground">Habilitar envío gratuito para pedidos superiores a un monto.</p>
                  </div>
                </div>
                <Switch defaultChecked={settings.shipping.freeShippingEnabled} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="minOrder">Monto mínimo para envío gratis</Label>
                <Input id="minOrder" type="number" defaultValue={settings.shipping.freeShippingThreshold} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones por Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Nuevos Pedidos</p>
                    <p className="text-sm text-muted-foreground">Recibir email cuando se crea un nuevo pedido.</p>
                  </div>
                </div>
                <Switch defaultChecked={settings.notifications.newOrder} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Bell className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Stock Bajo</p>
                    <p className="text-sm text-muted-foreground">Recibir alerta cuando un producto tiene poco stock.</p>
                  </div>
                </div>
                <Switch defaultChecked={settings.notifications.lowStock} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
