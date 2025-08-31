"use client"

import React from 'react'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from '@/components/ui'
import { soporteApi } from './client'
import type { TicketFormData, TicketPriority } from './types'
import toast from 'react-hot-toast'

const prioridades: TicketPriority[] = ["Baja", "Media", "Alta"]

export function TicketForm() {
  const [submitting, setSubmitting] = React.useState(false)
  const [form, setForm] = React.useState<TicketFormData>({
    nombre: '', email: '', asunto: '', categoria: '', prioridad: 'Media', descripcion: ''
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setForm(f => ({ ...f, [id]: value }))
  }

  const canSubmit = form.nombre && /.+@.+\..+/.test(form.email) && form.asunto && form.descripcion.length >= 10

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      const { id } = await soporteApi.crearTicket(form)
      toast.success(`Ticket creado: ${id}`)
      setForm({ nombre: '', email: '', asunto: '', categoria: '', prioridad: 'Media', descripcion: '' })
    } catch (e: any) {
      toast.error(e?.message || 'No se pudo crear el ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={onSubmit}>
        <CardHeader>
          <CardTitle>Crear Nuevo Ticket</CardTitle>
          <CardDescription>Describe tu problema y nuestro equipo técnico te ayudará.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" value={form.nombre} onChange={onChange} placeholder="Tu nombre" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={onChange} placeholder="tu@mail.com" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="asunto">Asunto</Label>
            <Input id="asunto" value={form.asunto} onChange={onChange} placeholder="Breve resumen del problema" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Input id="categoria" value={form.categoria} onChange={onChange} placeholder="Ej. Calibración" />
            </div>
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select value={form.prioridad} onValueChange={(v) => setForm(f => ({ ...f, prioridad: v as TicketPriority }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la prioridad" />
                </SelectTrigger>
                <SelectContent>
                  {prioridades.map(p => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción detallada</Label>
            <Textarea id="descripcion" value={form.descripcion} onChange={onChange} rows={6} placeholder="Incluye modelo de impresora, pasos reproducibles y fotos si es posible" required />
            <p className="text-xs text-muted-foreground">Mínimo 10 caracteres. Respuesta habitual en 24hs.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" variant="purple" className="w-full" disabled={!canSubmit || submitting}>
            {submitting ? 'Enviando...' : 'Enviar Ticket'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
