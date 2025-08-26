"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function PerfilPage() {
  const { user, updateProfile } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      // optional: load phone from somewhere if persisted in future
    }
  }, [user])

  if (!user) return null

  const onSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile({ name, email })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mi Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-6">Actualiza tu información personal</p>
        <form onSubmit={onSave} className="space-y-4 max-w-3xl">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" placeholder="+54 11 0000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Button type="submit" variant="purple">Guardar Cambios</Button>
        </form>
      </CardContent>
    </Card>
  )
}
