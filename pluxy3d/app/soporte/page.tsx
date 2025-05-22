import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Bot, Printer, Wrench, FileQuestion, User } from "lucide-react"
import Link from "next/link"

export default function SoportePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Soporte Técnico</h1>

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
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nuevo Ticket</CardTitle>
                  <CardDescription>
                    Completa el formulario para recibir asistencia técnica personalizada.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto</Label>
                    <Input id="subject" placeholder="Describe brevemente tu problema" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="printer-model">Modelo de Impresora</Label>
                    <Select>
                      <SelectTrigger id="printer-model">
                        <SelectValue placeholder="Selecciona tu modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ender3">Creality Ender 3</SelectItem>
                        <SelectItem value="ender3-v2">Creality Ender 3 V2</SelectItem>
                        <SelectItem value="ender3-pro">Creality Ender 3 Pro</SelectItem>
                        <SelectItem value="magna2">Hellbot Magna 2</SelectItem>
                        <SelectItem value="prusa-i3">Prusa i3 MK3S+</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issue-type">Tipo de Problema</Label>
                    <Select>
                      <SelectTrigger id="issue-type">
                        <SelectValue placeholder="Selecciona el tipo de problema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hardware">Hardware</SelectItem>
                        <SelectItem value="software">Software</SelectItem>
                        <SelectItem value="calibration">Calibración</SelectItem>
                        <SelectItem value="quality">Calidad de Impresión</SelectItem>
                        <SelectItem value="warranty">Garantía</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción Detallada</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe detalladamente el problema que estás experimentando"
                      rows={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attachments">Adjuntos (opcional)</Label>
                    <Input id="attachments" type="file" multiple />
                    <p className="text-sm text-muted-foreground">
                      Puedes adjuntar imágenes o videos que muestren el problema.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Enviar Ticket</Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Mis Tickets</CardTitle>
                  <CardDescription>Historial de tus tickets de soporte.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Problemas Ender 3</h3>
                          <p className="text-sm text-muted-foreground">
                            La impresora empezo saca las impresiones movidas
                          </p>
                        </div>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">En Proceso</span>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">Creado: 30 Nov, 2023</div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Extrusor dañado, garantía</h3>
                          <p className="text-sm text-muted-foreground">
                            El extrusor presenta fallas después de 2 semanas de uso
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Resuelto</span>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">Creado: 15 Nov, 2023</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Ver Todos los Tickets
                  </Button>
                </CardFooter>
              </Card>
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
                    <Button className="bg-purple-600 hover:bg-purple-700">Enviar</Button>
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
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
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
              <Card>
                <CardHeader>
                  <CardTitle>Preguntas Frecuentes</CardTitle>
                  <CardDescription>
                    Encuentra respuestas a las preguntas más comunes sobre impresoras 3D.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">¿Cómo calibro la cama de mi impresora 3D?</h3>
                      <p className="text-sm text-muted-foreground">
                        Para calibrar la cama de tu impresora 3D, sigue estos pasos:
                      </p>
                      <ol className="list-decimal list-inside text-sm mt-2 space-y-1 text-muted-foreground">
                        <li>Precalienta la cama a la temperatura de impresión</li>
                        <li>Utiliza la función de nivelación manual en el menú de la impresora</li>
                        <li>Ajusta los tornillos de nivelación en cada esquina</li>
                        <li>Utiliza una hoja de papel para verificar la distancia entre la boquilla y la cama</li>
                        <li>Repite el proceso varias veces para asegurar una nivelación uniforme</li>
                      </ol>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">¿Por qué mi filamento no sale de la boquilla?</h3>
                      <p className="text-sm text-muted-foreground">
                        Si el filamento no sale de la boquilla, puede deberse a:
                      </p>
                      <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-muted-foreground">
                        <li>Boquilla obstruida</li>
                        <li>Temperatura insuficiente</li>
                        <li>Problema en el extrusor</li>
                        <li>Filamento de baja calidad o húmedo</li>
                      </ul>
                      <p className="text-sm mt-2 text-muted-foreground">
                        Recomendamos limpiar la boquilla con el método de "cold pull" o reemplazarla si es necesario.
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">¿Cómo mejorar la adhesión de la primera capa?</h3>
                      <p className="text-sm text-muted-foreground">Para mejorar la adhesión de la primera capa:</p>
                      <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-muted-foreground">
                        <li>Asegúrate de que la cama esté bien nivelada</li>
                        <li>Limpia la superficie de impresión con alcohol isopropílico</li>
                        <li>Ajusta la altura de la primera capa en el slicer</li>
                        <li>Aumenta la temperatura de la cama para el primer par de capas</li>
                        <li>Utiliza adhesivos como laca para el cabello o pegamento en barra</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Ver Más Preguntas Frecuentes
                  </Button>
                </CardFooter>
              </Card>
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
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
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
