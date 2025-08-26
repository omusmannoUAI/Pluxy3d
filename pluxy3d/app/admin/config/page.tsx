"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

  const isEmail = (s: string) => /.+@.+\..+/.test(s)
  const inRange = (n: number, min: number, max: number) => Number.isFinite(n) && n >= min && n <= max

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
    const prev = settings as Settings
    const next = { ...prev, ...partial }
    setSettings(next)
    try {
      const res = await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(partial) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setSettings(json)
    } catch (e: any) {
      setSettings(prev)
      throw e
    } finally {
      setSaving(false)
    }
  }

  const handleSaveGeneral = async () => {
    const g = settings!.general
    if (!inRange(Number(g.taxRate), 0, 100)) {
      toast({ title: "Impuesto inválido", description: "La tasa debe estar entre 0 y 100.", variant: "destructive" })
      return
    }
    if (!isEmail(String(g.contactEmail || ""))) {
      toast({ title: "Email inválido", description: "Ingresá un email de contacto válido.", variant: "destructive" })
      return
    }
    try {
      await save({ general: g })
      toast({ title: "General guardado", description: "La configuración general se guardó correctamente." })
    } catch {
      toast({ title: "Error al guardar", description: "No pudimos guardar la configuración general.", variant: "destructive" })
    }
  }

  const handleSavePayments = async () => {
    const p = settings!.payments
    if (p.mercadoPago.enabled && (!p.mercadoPago.publicKey || !p.mercadoPago.accessToken)) {
      toast({ title: "Mercado Pago incompleto", description: "Public Key y Access Token son requeridos.", variant: "destructive" })
      return
    }
    if (p.stripe.enabled && (!p.stripe.publicKey || !p.stripe.secretKey)) {
      toast({ title: "Stripe incompleto", description: "Public y Secret Key son requeridos.", variant: "destructive" })
      return
    }
    if (!inRange(Number(p.cashOnDelivery.fee || 0), 0, Number.POSITIVE_INFINITY)) {
      toast({ title: "Recargo inválido", description: "El recargo debe ser 0 o mayor.", variant: "destructive" })
      return
    }
    try {
      await save({ payments: p })
      toast({ title: "Pagos guardados", description: "Métodos de pago actualizados." })
    } catch {
      toast({ title: "Error al guardar", description: "No pudimos guardar los pagos.", variant: "destructive" })
    }
  }

  const handleSaveShipping = async () => {
    const s = settings!.shipping
    if (!s.provider) {
      toast({ title: "Proveedor requerido", description: "Indicá un proveedor de envíos.", variant: "destructive" })
      return
    }
    if (!inRange(Number(s.flatRate || 0), 0, Number.POSITIVE_INFINITY)) {
      toast({ title: "Tarifa inválida", description: "La tarifa plana debe ser 0 o mayor.", variant: "destructive" })
      return
    }
    if (!inRange(Number(s.freeThreshold || 0), 0, Number.POSITIVE_INFINITY)) {
      toast({ title: "Mínimo de envío gratis inválido", description: "El monto debe ser 0 o mayor.", variant: "destructive" })
      return
    }
    const badZone = s.zones.find((z) => !z.name || !inRange(Number(z.rate || 0), 0, Number.POSITIVE_INFINITY))
    if (badZone) {
      toast({ title: "Zona inválida", description: "Cada zona debe tener nombre y tarifa >= 0.", variant: "destructive" })
      return
    }
    try {
      await save({ shipping: s })
      toast({ title: "Envíos guardados", description: "Configuración de envíos actualizada." })
    } catch {
      toast({ title: "Error al guardar", description: "No pudimos guardar envíos.", variant: "destructive" })
    }
  }

  const handleSaveSecurity = async () => {
    const s = settings!.security
    if (!inRange(Number(s.passwordMinLength || 0), 6, 256)) {
      toast({ title: "Contraseña muy corta", description: "Definí un mínimo de 6 caracteres o más.", variant: "destructive" })
      return
    }
    if (!inRange(Number(s.sessionTimeoutMinutes || 0), 5, 1440)) {
      toast({ title: "Timeout inválido", description: "Definí entre 5 y 1440 minutos.", variant: "destructive" })
      return
    }
    try {
      await save({ security: s })
      toast({ title: "Seguridad guardada", description: "Parámetros de seguridad actualizados." })
    } catch {
      toast({ title: "Error al guardar", description: "No pudimos guardar seguridad.", variant: "destructive" })
    }
  }

  const handleSaveNotifications = async () => {
    const n = settings!.notifications
    if (!n.smtp.host) {
      toast({ title: "SMTP host requerido", description: "Ingresá el host SMTP.", variant: "destructive" })
      return
    }
    if (!inRange(Number(n.smtp.port || 0), 1, 65535)) {
      toast({ title: "Puerto inválido", description: "Usá un puerto entre 1 y 65535.", variant: "destructive" })
      return
    }
    if (!isEmail(String(n.smtp.from || ""))) {
      toast({ title: "Remitente inválido", description: "Ingresá un email válido en From.", variant: "destructive" })
      return
    }
    try {
      await save({ notifications: n })
      toast({ title: "Notificaciones guardadas", description: "SMTP y plantillas actualizadas." })
    } catch {
      toast({ title: "Error al guardar", description: "No pudimos guardar notificaciones.", variant: "destructive" })
    }
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
              <Button className="mt-2" onClick={handleSaveGeneral} disabled={saving}>
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
        <Input type="password" autoComplete="current-password" value={settings.payments.mercadoPago.accessToken} onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, mercadoPago: { ...settings.payments.mercadoPago, accessToken: e.target.value } } })} />
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
                    <Input type="password" autoComplete="current-password" value={settings.payments.stripe.secretKey} onChange={(e) => setSettings({ ...settings, payments: { ...settings.payments, stripe: { ...settings.payments.stripe, secretKey: e.target.value } } })} />
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
              <Button onClick={handleSavePayments} disabled={saving}>{saving ? "Guardando..." : "Guardar Pagos"}</Button>
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
          <Input type="number" min={5} max={1440} value={settings.security.sessionTimeoutMinutes} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, sessionTimeoutMinutes: Number(e.target.value) } })} />
                </div>
                <div>
                  <Label>reCAPTCHA Site Key</Label>
                  <Input value={settings.security.recaptchaSiteKey} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, recaptchaSiteKey: e.target.value } })} />
                </div>
                <div>
                  <Label>reCAPTCHA Secret Key</Label>
          <Input type="password" autoComplete="current-password" value={settings.security.recaptchaSecretKey} onChange={(e) => setSettings({ ...settings, security: { ...settings.security, recaptchaSecretKey: e.target.value } })} />
                </div>
              </div>
        <Button onClick={handleSaveSecurity} disabled={saving}>{saving ? "Guardando..." : "Guardar Seguridad"}</Button>
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
                  <Input type="number" min={1} max={65535} value={settings.notifications.smtp.port} onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smtp: { ...settings.notifications.smtp, port: Number(e.target.value) } } })} />
                </div>
                <div>
                  <Label>SMTP User</Label>
                  <Input value={settings.notifications.smtp.user} onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smtp: { ...settings.notifications.smtp, user: e.target.value } } })} />
                </div>
                <div>
                  <Label>SMTP Pass</Label>
                  <Input type="password" autoComplete="current-password" value={settings.notifications.smtp.pass} onChange={(e) => setSettings({ ...settings, notifications: { ...settings.notifications, smtp: { ...settings.notifications.smtp, pass: e.target.value } } })} />
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
              <Button onClick={handleSaveNotifications} disabled={saving}>{saving ? "Guardando..." : "Guardar Notificaciones"}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
