"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast" 
import { apiFetch } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ContactoPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.email || !form.mensaje) {
      toast({ title: "Campos requeridos", description: "Completa todos los campos.", variant: "destructive" })
      return
    }
    try {
      setLoading(true)
      await apiFetch('/contacto', { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(form) 
      }) 
      toast({ title: "Enviado", description: "Gracias por contactarnos." })
      setForm({ nombre: "", email: "", mensaje: "" })
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Intenta nuevamente.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-muted">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver al Inicio
        </Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Contacto</h1>
      <p className="text-muted-foreground mb-6">Envíanos tu consulta y te responderemos a la brevedad.</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <Input value={form.nombre} onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Tu nombre" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="tu@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mensaje</label>
          <Textarea rows={5} value={form.mensaje} onChange={(e) => setForm(f => ({ ...f, mensaje: e.target.value }))} placeholder="¿En qué podemos ayudarte?" />
        </div>
        <Button type="submit" variant="purple" disabled={loading}>{loading ? "Enviando..." : "Enviar"}</Button>
      </form>
    </div>
  )
}
