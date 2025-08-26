"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

type Settings = {
  general: any
  payments: {
    mercadoPago: { enabled: boolean; publicKey: string; accessToken: string }
    stripe: { enabled: boolean; publicKey: string; secretKey: string }
    bankTransfer: { enabled: boolean; instructions: string }
    cashOnDelivery: { enabled: boolean; fee: number }
  }
  shipping: {
    provider: string
    flatRate: number
    freeThreshold: number
    pickupEnabled: boolean
    zones: { name: string; rate: number }[]
  }
  security: {
    passwordMinLength: number
    requireStrongPassword: boolean
    twoFactorAuth: boolean
    sessionTimeoutMinutes: number
    recaptchaSiteKey: string
    recaptchaSecretKey: string
  }
  notifications: {
    smtp: { host: string; port: number; user: string; pass: string; from: string }
    templates: { [k: string]: boolean }
  }
}

export default function AdminConfigPage() {
  const [settings, setSettings] = React.useState<Settings | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    let disposed = false
    fetch("/api/settings")
      .then((r) => r.json())
      .then((json) => {
        if (!disposed) setSettings(json)
      })
      .finally(() => !disposed && setLoading(false))
    return () => {
      disposed = true
    }
  }, [])

  const save = async (partial: Partial<Settings>) => {
    setSaving(true)
    const next = { ...(settings as any), ...partial }
    setSettings(next)
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(partial) })
    setSaving(false)
  }

  if (loading || !settings) {
    return <div className="h-40 animate-pulse rounded bg-muted" />
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Configuraciones</h2>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pagos">Pagos</TabsTrigger>
          <TabsTrigger value="envios">Envíos</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre del Sitio</Label>
                  <Input value={settings.general.siteName} onChange={(e) => setSettings({ ...settings, general: { ...settings.general, siteName: e.target.value } })} />
                </div>
                <div>
                  <Label>Moneda</Label>
                  <Input value={settings.general.currency} onChange={(e) => setSettings({ ...settings, general: { ...settings.general, currency: e.target.value } })} />
                </div>
                <div>
                  <Label>URL del Sitio</Label>
                  <Input value={settings.general.siteUrl} onChange={(e) => setSettings({ ...settings, general: { ...settings.general, siteUrl: e.target.value } })} />
                </div>
                <div>
                  <Label>Tasa de Impuesto (%)</Label>
                  <Input type="number" value={settings.general.taxRate} onChange={(e) => setSettings({ ...settings, general: { ...settings.general, taxRate: Number(e.target.value) } })} />
                </div>
                <div>
                  <Label>Email de Contacto</Label>
                  <Input value={settings.general.contactEmail} onChange={(e) => setSettings({ ...settings, general: { ...settings.general, contactEmail: e.target.value } })} />
                </div>
                <div>
                  <Label>Dirección</Label>
                  <Input value={settings.general.address} onChange={(e) => setSettings({ ...settings, general: { ...settings.general, address: e.target.value } })} />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input value={settings.general.phone} onChange={(e) => setSettings({ ...settings, general: { ...settings.general, phone: e.target.value } })} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label>Funcionalidades</Label>
                  <div className="flex items-center justify-between"><span>Permitir Registro</span><Switch checked={Boolean(settings.general.features?.allowRegister)} onCheckedChange={(c) => setSettings({ ...settings, general: { ...settings.general, features: { ...settings.general.features, allowRegister: Boolean(c) } } })} /></div>
                  <div className="flex items-center justify-between"><span>Habilitar Reseñas</span><Switch checked={Boolean(settings.general.features?.enableReviews)} onCheckedChange={(c) => setSettings({ ...settings, general: { ...settings.general, features: { ...settings.general.features, enableReviews: Boolean(c) } } })} /></div>
                  <div className="flex items-center justify-between"><span>Cupones de Descuento</span><Switch checked={Boolean(settings.general.features?.enableCoupons)} onCheckedChange={(c) => setSettings({ ...settings, general: { ...settings.general, features: { ...settings.general.features, enableCoupons: Boolean(c) } } })} /></div>
                </div>
                <div className="space-y-3">
                  <Label>Seguridad</Label>
                  <div className="flex items-center justify-between"><span>Verificación de Email</span><Switch checked={Boolean(settings.general.security?.emailVerification)} onCheckedChange={(c) => setSettings({ ...settings, general: { ...settings.general, security: { ...settings.general.security, emailVerification: Boolean(c) } } })} /></div>
                  <div className="flex items-center justify-between"><span>Lista de Deseos</span><Switch checked={Boolean(settings.general.security?.wishlist)} onCheckedChange={(c) => setSettings({ ...settings, general: { ...settings.general, security: { ...settings.general.security, wishlist: Boolean(c) } } })} /></div>
                  <div className="flex items-center justify-between"><span>Modo Mantenimiento</span><Switch checked={Boolean(settings.general.security?.maintenanceMode)} onCheckedChange={(c) => setSettings({ ...settings, general: { ...settings.general, security: { ...settings.general.security, maintenanceMode: Boolean(c) } } })} /></div>
                </div>
              </div>
              <Button className="mt-2" onClick={() => save({ general: settings.general })} disabled={saving}>
                {saving ? "Guardando..." : "Guardar Configuración"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pagos">
          <Card>
            <CardHeader>
              <CardTitle>Pagos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mercado Pago */}
              <div className="space-y-2">
                <Label className="font-semibold">Mercado Pago</Label>
                <div className="flex items-center justify-between"><span>Habilitado</span><Switch checked={settings.payments.mercadoPago.enabled} onCheckedChange={(c) => setSettings({ ...settings, payments: { ...settings.payments, mercadoPago: { ...settings.payments.mercadoPago, enabled: Boolean(c) } } })} /></div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Public Key</Label>
                    <Input value={settings.payments.mercadoPago.publicKey} onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, mercadoPago: { ...settings.payments.mercadoPago, publicKey: e.target.value } } })} />
                  </div>
                  <div>
                    <Label>Access Token</Label>
                    <Input value={settings.payments.mercadoPago.accessToken} onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, mercadoPago: { ...settings.payments.mercadoPago, accessToken: e.target.value } } })} />
                  </div>
                </div>
              </div>
              {/* Stripe */}
              <div className="space-y-2">
                <Label className="font-semibold">Stripe</Label>
                <div className="flex items-center justify-between"><span>Habilitado</span><Switch checked={settings.payments.stripe.enabled} onCheckedChange={(c) => setSettings({ ...settings, payments: { ...settings.payments, stripe: { ...settings.payments.stripe, enabled: Boolean(c) } } })} /></div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label>Public Key</Label>
                    <Input value={settings.payments.stripe.publicKey} onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, stripe: { ...settings.payments.stripe, publicKey: e.target.value } } })} />
                  </div>
                  <div>
                    <Label>Secret Key</Label>
                    <Input value={settings.payments.stripe.secretKey} onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, stripe: { ...settings.payments.stripe, secretKey: e.target.value } } })} />
                  </div>
                </div>
              </div>
              {/* Bank Transfer */}
              <div className="space-y-2">
                <Label className="font-semibold">Transferencia Bancaria</Label>
                <div className="flex items-center justify-between"><span>Habilitado</span><Switch checked={settings.payments.bankTransfer.enabled} onCheckedChange={(c) => setSettings({ ...settings, payments: { ...settings.payments, bankTransfer: { ...settings.payments.bankTransfer, enabled: Boolean(c) } } })} /></div>
                <div>
                  <Label>Instrucciones</Label>
                  <Input value={settings.payments.bankTransfer.instructions} onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, bankTransfer: { ...settings.payments.bankTransfer, instructions: e.target.value } } })} />
                </div>
              </div>
              {/* Cash on Delivery */}
              <div className="space-y-2">
                <Label className="font-semibold">Pago Contra Entrega</Label>
                <div className="flex items-center justify-between"><span>Habilitado</span><Switch checked={settings.payments.cashOnDelivery.enabled} onCheckedChange={(c) => setSettings({ ...settings, payments: { ...settings.payments, cashOnDelivery: { ...settings.payments.cashOnDelivery, enabled: Boolean(c) } } })} /></div>
                <div>
                  <Label>Recargo</Label>
                  <Input type="number" value={settings.payments.cashOnDelivery.fee} onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, cashOnDelivery: { ...settings.payments.cashOnDelivery, fee: Number(e.target.value) } } })} />
                </div>
              </div>
              <Button onClick={() => save({ payments: settings.payments })} disabled={saving}>{saving ? "Guardando..." : "Guardar Pagos"}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="envios">
          <Card>
            <CardHeader>
              <CardTitle>Envíos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Proveedor</Label>
                  <Input value={settings.shipping.provider} onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, provider: e.target.value } })} />
                </div>
                <div>
                  <Label>Tarifa Plana</Label>
                  <Input type="number" value={settings.shipping.flatRate} onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, flatRate: Number(e.target.value) } })} />
                </div>
                <div>
                  <Label>Envío Gratis desde</Label>
                  <Input type="number" value={settings.shipping.freeThreshold} onChange={(e) => setSettings({ ...settings, shipping: { ...settings.shipping, freeThreshold: Number(e.target.value) } })} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Retiro en Tienda</span>
                  <Switch checked={settings.shipping.pickupEnabled} onCheckedChange={(c) => setSettings({ ...settings, shipping: { ...settings.shipping, pickupEnabled: Boolean(c) } })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Zonas</Label>
                <div className="space-y-2">
                  {settings.shipping.zones.map((z, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <Input value={z.name} onChange={(e) => {
                        const zones = settings.shipping.zones.slice(); zones[idx] = { ...z, name: e.target.value }; setSettings({ ...settings, shipping: { ...settings.shipping, zones } })
                      }} />
                      <Input type="number" value={z.rate} onChange={(e) => {
                        const zones = settings.shipping.zones.slice(); zones[idx] = { ...z, rate: Number(e.target.value) }; setSettings({ ...settings, shipping: { ...settings.shipping, zones } })
                      }} />
                      <Button variant="outline" onClick={() => { const zones = settings.shipping.zones.filter((_, i) => i !== idx); setSettings({ ...settings, shipping: { ...settings.shipping, zones } }) }}>Eliminar</Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => setSettings({ ...settings, shipping: { ...settings.shipping, zones: [...settings.shipping.zones, { name: "Nueva Zona", rate: 0 }] } })}>Agregar Zona</Button>
                </div>
              </div>
              <Button onClick={() => save({ shipping: settings.shipping })} disabled={saving}>{saving ? "Guardando..." : "Guardar Envíos"}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="seguridad">
          <Card>
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Longitud mínima de contraseña</Label>
                  <Input type="number" value={settings.security.passwordMinLength} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, passwordMinLength: Number(e.target.value) } })} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Requerir contraseña fuerte</span>
                  <Switch checked={settings.security.requireStrongPassword} onCheckedChange={(c) => setSettings({ ...settings, security: { ...settings.security, requireStrongPassword: Boolean(c) } })} />
                </div>
                <div className="flex items-center justify-between">
                  <span>Autenticación de dos factores</span>
                  <Switch checked={settings.security.twoFactorAuth} onCheckedChange={(c) => setSettings({ ...settings, security: { ...settings.security, twoFactorAuth: Boolean(c) } })} />
                </div>
                <div>
                  <Label>Timeout de sesión (min)</Label>
                  <Input type="number" value={settings.security.sessionTimeoutMinutes} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sessionTimeoutMinutes: Number(e.target.value) } })} />
                </div>
                <div>
                  <Label>reCAPTCHA Site Key</Label>
                  <Input value={settings.security.recaptchaSiteKey} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, recaptchaSiteKey: e.target.value } })} />
                </div>
                <div>
                  <Label>reCAPTCHA Secret Key</Label>
                  <Input value={settings.security.recaptchaSecretKey} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, recaptchaSecretKey: e.target.value } })} />
                </div>
              </div>
              <Button onClick={() => save({ security: settings.security })} disabled={saving}>{saving ? "Guardando..." : "Guardar Seguridad"}</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notificaciones">
          <Card>
            <CardHeader>
              <CardTitle>Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>SMTP Host</Label>
                  <Input value={settings.notifications.smtp.host} onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smtp: { ...settings.notifications.smtp, host: e.target.value } } })} />
                </div>
                <div>
                  <Label>SMTP Port</Label>
                  <Input type="number" value={settings.notifications.smtp.port} onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smtp: { ...settings.notifications.smtp, port: Number(e.target.value) } } })} />
                </div>
                <div>
                  <Label>SMTP User</Label>
                  <Input value={settings.notifications.smtp.user} onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smtp: { ...settings.notifications.smtp, user: e.target.value } } })} />
                </div>
                <div>
                  <Label>SMTP Pass</Label>
                  <Input value={settings.notifications.smtp.pass} onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smtp: { ...settings.notifications.smtp, pass: e.target.value } } })} />
                </div>
                <div className="md:col-span-2">
                  <Label>From</Label>
                  <Input value={settings.notifications.smtp.from} onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smtp: { ...settings.notifications.smtp, from: e.target.value } } })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Plantillas</Label>
                {Object.entries(settings.notifications.templates).map(([key, val]) => (
                  <div className="flex items-center justify-between" key={key}>
                    <span>{key}</span>
                    <Switch checked={Boolean(val)} onCheckedChange={(c) => setSettings({ ...settings, notifications: { ...settings.notifications, templates: { ...settings.notifications.templates, [key]: Boolean(c) } } })} />
                  </div>
                ))}
              </div>
              <Button onClick={() => save({ notifications: settings.notifications })} disabled={saving}>{saving ? "Guardando..." : "Guardar Notificaciones"}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
