"use client"

import { useEffect, useState } from "react"
import { 
  Search, 
  Star, 
  Check, 
  X, 
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getReviews } from "@/services/api"

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    setLoading(true)
    try {
      const data = await getReviews()
      setReviews(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cupones</h1>
          <p className="text-muted-foreground">Gestión de Reseñas</p>
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
        <h2 className="text-xl font-bold mb-6">Modera las reseñas de productos</h2>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Checkbox id="select-all" />
            <label htmlFor="select-all" className="text-sm text-muted-foreground">
              Seleccionar página (0/3)
            </label>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input placeholder="Buscar por producto, autor o email" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="approved">Aprobadas</SelectItem>
                <SelectItem value="rejected">Rechazadas</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas las calificaciones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las calificaciones</SelectItem>
                <SelectItem value="5">5 Estrellas</SelectItem>
                <SelectItem value="4">4 Estrellas</SelectItem>
                <SelectItem value="3">3 Estrellas</SelectItem>
                <SelectItem value="2">2 Estrellas</SelectItem>
                <SelectItem value="1">1 Estrella</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2 ml-auto">
              <Button variant="outline" size="sm" className="text-xs">
                Aprobar seleccionadas
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Rechazar seleccionadas
              </Button>
              <Button variant="outline" size="sm" className="text-xs text-red-500 hover:text-red-600">
                Eliminar seleccionadas
              </Button>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm font-medium">
            <span className="text-muted-foreground">Pendientes: 2</span>
            <span className="text-muted-foreground">Aprobadas: 1</span>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex gap-4 items-start">
                <Checkbox className="mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{review.productName}</h3>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Por {review.author} ({review.email})
                      </p>
                      <p className="mt-2 text-sm">{review.comment}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {review.date} • {review.helpfulCount} personas encontraron esto útil
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        variant={review.status === "Approved" ? "secondary" : "outline"}
                        className={review.status === "Approved" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {review.status === "Approved" ? "Aprobada" : review.status === "Pending" ? "Pendiente" : "Rechazada"}
                      </Badge>
                      
                      <div className="flex gap-2 mt-2">
                        {review.status === "Pending" && (
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            Aprobar
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          Rechazar
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs text-red-500 hover:text-red-600">
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" size="sm" disabled>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">Página 1 de 1</span>
          <Button variant="ghost" size="sm" disabled>
            Siguiente
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
