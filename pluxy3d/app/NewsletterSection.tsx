"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      setLoading(true)
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`)
      toast({ title: "¡Gracias!", description: json?.message || "Suscripción registrada." })
      setEmail("")
    } catch (err: any) {
      toast({
        title: "No pudimos suscribirte",
        description: err?.message || "Intentalo de nuevo en unos minutos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full bg-purple-600 text-white">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <h2 className="text-3xl font-bold text-center">Mantente Actualizado</h2>
        <p className="text-center text-purple-100 mt-2 max-w-2xl mx-auto">
          Suscríbete a nuestro newsletter y recibe las últimas novedades, ofertas especiales y consejos de impresión 3D
        </p>
        <form onSubmit={onSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
          <Input
            placeholder="Tu email"
            type="email"
            className="bg-white text-foreground"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" className="bg-white text-purple-700 hover:bg-white/90" disabled={loading}>
            {loading ? "Enviando…" : "Suscribirse"}
          </Button>
        </form>
      </div>
    </section>
  )
}
