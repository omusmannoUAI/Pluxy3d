"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Printer, Pause, Play, StopCircle, MessageSquare, Settings, RefreshCw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PrinterStatus {
  id: string
  name: string
  status: "printing" | "idle" | "paused" | "error"
  progress: number
  hotendTemp: number
  bedTemp: number
  timeRemaining: string
  currentPrint?: {
    name: string
    startTime: string
    estimatedEndTime: string
  }
}

export default function StatusPage() {
  const [printers, setPrinters] = useState<PrinterStatus[]>([
    {
      id: "ender3-v2",
      name: "Ender 3 - V2",
      status: "printing",
      progress: 35,
      hotendTemp: 210,
      bedTemp: 60,
      timeRemaining: "3h 30m",
      currentPrint: {
        name: "owl_0.1mm_PLA_MINI_5h24m.gcode",
        startTime: "14:26",
        estimatedEndTime: "19:56",
      },
    },
    {
      id: "ender3-v1",
      name: "Ender 3 - V1",
      status: "idle",
      progress: 0,
      hotendTemp: 25,
      bedTemp: 25,
      timeRemaining: "0h 0m",
    },
  ])

  const handlePausePrinter = (id: string) => {
    setPrinters(
      printers.map((printer) =>
        printer.id === id ? { ...printer, status: printer.status === "paused" ? "printing" : "paused" } : printer,
      ),
    )
  }

  const handleStopPrinter = (id: string) => {
    setPrinters(
      printers.map((printer) =>
        printer.id === id
          ? { ...printer, status: "idle", progress: 0, timeRemaining: "0h 0m", currentPrint: undefined }
          : printer,
      ),
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Estado de Impresoras</h1>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {printers.map((printer) => (
          <Card key={printer.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Printer className="mr-2 h-5 w-5 text-purple-600" />
                  {printer.name}
                </CardTitle>
                <StatusBadge status={printer.status} />
              </div>
              <CardDescription>
                {printer.status === "printing" && printer.currentPrint
                  ? `Imprimiendo: ${printer.currentPrint.name}`
                  : "Sin trabajos activos"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {printer.status === "printing" && (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso:</span>
                      <span>{printer.progress}%</span>
                    </div>
                    <Progress value={printer.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Inicio:</span>
                        <span>{printer.currentPrint?.startTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fin estimado:</span>
                        <span>{printer.currentPrint?.estimatedEndTime}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tiempo restante:</span>
                        <span>{printer.timeRemaining}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">HotEnd:</span>
                        <span>{printer.hotendTemp}°C</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Cama:</span>
                        <span>{printer.bedTemp}°C</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative h-48 w-full bg-gray-100 rounded-md overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=200&width=300"
                      alt="Vista previa de impresión"
                      fill
                      className="object-contain"
                    />
                  </div>
                </>
              )}

              {printer.status === "idle" && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">La impresora está lista para un nuevo trabajo.</p>
                    <Button className="bg-purple-600 hover:bg-purple-700">Iniciar Nueva Impresión</Button>
                  </div>
                </div>
              )}

              {printer.status === "error" && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="text-center space-y-4">
                    <p className="text-red-500">Se ha detectado un error en la impresora.</p>
                    <Button variant="destructive">Ver Detalles del Error</Button>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="flex gap-2">
                {printer.status === "printing" || printer.status === "paused" ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => handlePausePrinter(printer.id)}>
                      {printer.status === "paused" ? (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Reanudar
                        </>
                      ) : (
                        <>
                          <Pause className="mr-2 h-4 w-4" />
                          Pausar
                        </>
                      )}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleStopPrinter(printer.id)}>
                      <StopCircle className="mr-2 h-4 w-4" />
                      Detener
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Button>
                )}
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/asistente">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chatear con IA
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: PrinterStatus["status"] }) {
  switch (status) {
    case "printing":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Imprimiendo</Badge>
    case "paused":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pausado</Badge>
    case "error":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>
    case "idle":
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactivo</Badge>
    default:
      return null
  }
}
