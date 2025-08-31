export type TicketPriority = "Baja" | "Media" | "Alta"
export type TicketStatus = "Abierto" | "En Progreso" | "Resuelto" | "Cerrado"

export interface TicketFormData {
  nombre: string
  email: string
  asunto: string
  categoria: string
  prioridad: TicketPriority
  descripcion: string
  adjuntos?: File[]
}

export interface TicketSummary {
  id: string
  titulo: string
  resumen: string
  creadoEl: string
  prioridad: TicketPriority
  estado: TicketStatus
}
