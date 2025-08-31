"use client"

import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label, Input } from "@/components/ui"
import { MessageSquare, Bot, Printer, Wrench, FileQuestion, User, Phone, Mail, Clock } from "lucide-react"
import Link from "next/link"
import { TicketForm } from "./TicketForm"
import { TicketsSidebar } from "./TicketsSidebar"
import { FAQAccordion } from "./FAQAccordion"

export default function SoporteContent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Centro de Soporte</h1>

      {/* Contact quick cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-100"><Phone className="text-purple-600" /></div>
            <div>
              <div className="text-sm text-muted-foreground">Teléfono</div>
              <div className="font-medium">+54 11 1234-5678</div>
              <div className="text-xs text-muted-foreground">Lun-Vie 9:00-18:00</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-100"><Mail className="text-purple-600" /></div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">soporte@pluxy3d.com</div>
              <div className="text-xs text-muted-foreground">Respuesta en 24hs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-100"><Clock className="text-purple-600" /></div>
            <div>
              <div className="text-sm text-muted-foreground">Horarios</div>
              <div className="font-medium">Lun-Vie: 9:00-18:00</div>
              <div className="text-xs text-muted-foreground">Sáb: 9:00-13:00</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="tickets">
            <MessageSquare className="mr-2 h-4 w-4" />
            Sistema de Tickets
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Bot className="mr-2 h-4 w-4" />
            Asistente IA
          </TabsTrigger>
          <TabsTrigger value="faq">
            <FileQuestion className="mr-2 h-4 w-4" />
            Preguntas Frecuentes
          </TabsTrigger>
        </TabsList>

        {/* Tickets System */}
        <TabsContent value="tickets" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <TicketForm />
            </div>

            <div>
              <TicketsSidebar />
            </div>
          </div>
        </TabsContent>

        {/* AI Assistant */}
        <TabsContent value="ai" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle>Asistente IA</CardTitle>
                  <CardDescription>Consulta con nuestro asistente IA para resolver problemas comunes.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 bg-muted p-4 rounded-lg">
                      <p className="text-sm">
                        ¡Hola! Soy Marilin-IA, tu asistente virtual para impresoras 3D. ¿En qué puedo ayudarte hoy?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1 border p-4 rounded-lg">
                      <p className="text-sm">
                        Hola, tengo problemas con mi Ender 3. Las impresiones están saliendo movidas hacia un lado.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 bg-muted p-4 rounded-lg">
                      <p className="text-sm">Entiendo tu problema. Las impresiones desplazadas suelen deberse a:</p>
                      <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                        <li>Correas flojas en los ejes X o Y</li>
                        <li>Poleas sueltas en los motores</li>
                        <li>Problemas con los drivers de los motores</li>
                        <li>Voltaje incorrecto en los drivers</li>
                      </ol>
                      <p className="text-sm mt-2">
                        Te recomiendo revisar primero las correas. ¿Podrías verificar si están tensas?
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex w-full gap-2">
                    <Input placeholder="Escribe tu consulta aquí..." />
                    <Button variant="purple">Enviar</Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Estado de Impresora</CardTitle>
                  <CardDescription>Monitorea el estado de tu impresora 3D.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Printer className="h-5 w-5 text-purple-600" />
                      <h3 className="font-medium">Ender 3 - V2</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estado:</span>
                        <span className="font-medium text-green-600">Imprimiendo</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso:</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Temperatura HotEnd:</span>
                        <span className="font-medium">210°C</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Temperatura Cama:</span>
                        <span className="font-medium">60°C</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tiempo restante:</span>
                        <span className="font-medium">3h 30m</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="purple" className="w-full" asChild>
                    <Link href="/status">Monitorear Impresoras</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Recursos Útiles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/guias/calibracion">
                      <Wrench className="mr-2 h-4 w-4" />
                      Guía de Calibración
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/guias/mantenimiento">
                      <Wrench className="mr-2 h-4 w-4" />
                      Mantenimiento Preventivo
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/guias/solucion-problemas">
                      <Wrench className="mr-2 h-4 w-4" />
                      Solución de Problemas Comunes
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <FAQAccordion />
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contacto Directo</CardTitle>
                  <CardDescription>¿No encuentras la respuesta que buscas?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Si no has encontrado la solución a tu problema, puedes contactarnos directamente:
                  </p>
                  <div className="space-y-4">
                    <Button variant="purple" className="w-full" asChild>
                      <Link href="/soporte?tab=tickets">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Crear Ticket de Soporte
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/contacto">Formulario de Contacto</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Horario de Atención</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lunes a Viernes:</span>
                      <span>9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sábados:</span>
                      <span>10:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Domingos:</span>
                      <span>Cerrado</span>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Tiempo de respuesta promedio: 24 horas hábiles</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
