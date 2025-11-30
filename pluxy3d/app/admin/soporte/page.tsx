"use client"

import { useEffect, useState } from "react"
import { 
  Search, 
  Plus,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getSupportTickets } from "@/services/api"

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTickets()
  }, [])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const data = await getSupportTickets()
      setTickets(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setTickets([])
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Medium": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Low": return "bg-green-100 text-green-800 hover:bg-green-100"
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "High": return "Alta"
      case "Medium": return "Media"
      case "Low": return "Baja"
      default: return priority
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Open": return "Abierto"
      case "In Progress": return "En Proceso"
      case "Resolved": return "Resuelto"
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
          <p className="text-muted-foreground">Gestión de Soporte</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-8 w-64" />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">4</div>
            <span className="sr-only">Notificaciones</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </Button>
          <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            A
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Administra tickets de soporte técnico</h2>
          <Button className="bg-black text-white hover:bg-gray-800">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Ticket
          </Button>
        </div>

        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg">{ticket.id}</span>
                    <h3 className="font-bold text-lg">{ticket.subject}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {ticket.customer} ({ticket.email})
                  </p>
                  <p className="text-sm mb-3">{ticket.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>Creado: {ticket.created}</span>
                    <span>Actualizado: {ticket.updated}</span>
                    <span>Asignado a: {ticket.assignedTo}</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end gap-2 min-w-[120px]">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className={getPriorityColor(ticket.priority)}>
                      {getPriorityLabel(ticket.priority)}
                    </Badge>
                    <Badge variant="outline">
                      {getStatusLabel(ticket.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
