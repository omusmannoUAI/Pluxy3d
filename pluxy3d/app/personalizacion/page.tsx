"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Printer, Wrench, Palette, ShoppingCart } from "lucide-react"
import Image from "next/image"

export default function PersonalizacionPage() {
  const [selectedPrinter, setSelectedPrinter] = useState<string | null>(null)
  const [selectedExtruder, setSelectedExtruder] = useState<string | null>(null)
  const [selectedBuildPlate, setSelectedBuildPlate] = useState<string | null>(null)
  const [totalPrice, setTotalPrice] = useState(320000)

  const handlePrinterSelect = (printer: string) => {
    setSelectedPrinter(printer)
    // Reset components when changing printer
    setSelectedExtruder(null)
    setSelectedBuildPlate(null)

    // Update base price
    if (printer === "ender3-v2") {
      setTotalPrice(320000)
    } else if (printer === "ender3-v1") {
      setTotalPrice(280000)
    }
  }

  const handleExtruderSelect = (extruder: string) => {
    // If same extruder is selected, deselect it
    if (selectedExtruder === extruder) {
      setSelectedExtruder(null)
      // Remove extruder price
      if (extruder === "kit-mejora") {
        setTotalPrice((prev) => prev - 22750)
      } else if (extruder === "kit-doble") {
        setTotalPrice((prev) => prev - 19000)
      }
    } else {
      // If different extruder is selected, update selection and price
      // First remove previous extruder price if any
      if (selectedExtruder === "kit-mejora") {
        setTotalPrice((prev) => prev - 22750)
      } else if (selectedExtruder === "kit-doble") {
        setTotalPrice((prev) => prev - 19000)
      }

      // Add new extruder price
      if (extruder === "kit-mejora") {
        setTotalPrice((prev) => prev + 22750)
      } else if (extruder === "kit-doble") {
        setTotalPrice((prev) => prev + 19000)
      }

      setSelectedExtruder(extruder)
    }
  }

  const handleBuildPlateSelect = (plate: string) => {
    // If same plate is selected, deselect it
    if (selectedBuildPlate === plate) {
      setSelectedBuildPlate(null)
      // Remove plate price
      if (plate === "pei") {
        setTotalPrice((prev) => prev - 8500)
      } else if (plate === "glass") {
        setTotalPrice((prev) => prev - 6000)
      }
    } else {
      // If different plate is selected, update selection and price
      // First remove previous plate price if any
      if (selectedBuildPlate === "pei") {
        setTotalPrice((prev) => prev - 8500)
      } else if (selectedBuildPlate === "glass") {
        setTotalPrice((prev) => prev - 6000)
      }

      // Add new plate price
      if (plate === "pei") {
        setTotalPrice((prev) => prev + 8500)
      } else if (plate === "glass") {
        setTotalPrice((prev) => prev + 6000)
      }

      setSelectedBuildPlate(plate)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Personalización de Impresora</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="printer" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="printer">
                <Printer className="mr-2 h-4 w-4" />
                Impresora
              </TabsTrigger>
              <TabsTrigger value="components">
                <Wrench className="mr-2 h-4 w-4" />
                Componentes
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="mr-2 h-4 w-4" />
                Apariencia
              </TabsTrigger>
            </TabsList>

            {/* Printer Selection */}
            <TabsContent value="printer" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card
                  className={`cursor-pointer ${selectedPrinter === "ender3-v2" ? "ring-2 ring-purple-600" : ""}`}
                  onClick={() => handlePrinterSelect("ender3-v2")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle>Creality Ender 3 V2</CardTitle>
                    <CardDescription>Impresora 3D de alta calidad para principiantes y profesionales</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-48 w-full mb-4">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Creality Ender 3 V2"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volumen de impresión:</span>
                        <span>220 x 220 x 250 mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Velocidad máxima:</span>
                        <span>100 mm/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resolución:</span>
                        <span>0.1 mm</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full text-right">
                      <span className="text-xl font-bold">$320.000</span>
                    </div>
                  </CardFooter>
                </Card>

                <Card
                  className={`cursor-pointer ${selectedPrinter === "ender3-v1" ? "ring-2 ring-purple-600" : ""}`}
                  onClick={() => handlePrinterSelect("ender3-v1")}
                >
                  <CardHeader className="pb-2">
                    <CardTitle>Creality Ender 3</CardTitle>
                    <CardDescription>Impresora 3D económica y confiable</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-48 w-full mb-4">
                      <Image
                        src="/placeholder.svg?height=200&width=300"
                        alt="Creality Ender 3"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Volumen de impresión:</span>
                        <span>220 x 220 x 250 mm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Velocidad máxima:</span>
                        <span>80 mm/s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resolución:</span>
                        <span>0.1 mm</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full text-right">
                      <span className="text-xl font-bold">$280.000</span>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div className="mt-6">
                <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled={!selectedPrinter}>
                  Continuar a Componentes
                </Button>
              </div>
            </TabsContent>

            {/* Components Selection */}
            <TabsContent value="components" className="mt-6">
              <div className="space-y-8">
                {/* Extruder Selection */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Selecciona un Extrusor</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card
                      className={`cursor-pointer ${selectedExtruder === "kit-mejora" ? "ring-2 ring-purple-600" : ""}`}
                      onClick={() => handleExtruderSelect("kit-mejora")}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle>Kit Mejora Ender-3</CardTitle>
                        <CardDescription>Kit completo con extrusor, teflón y resortes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="relative h-32 w-full mb-4">
                          <Image
                            src="/placeholder.svg?height=150&width=200"
                            alt="Kit Mejora Ender-3"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Compatibilidad:</span>
                            <span>Ender 3, Ender 3 V2</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Material:</span>
                            <span>Aluminio</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full text-right">
                          <span className="text-xl font-bold">$22.750</span>
                        </div>
                      </CardFooter>
                    </Card>

                    <Card
                      className={`cursor-pointer ${selectedExtruder === "kit-doble" ? "ring-2 ring-purple-600" : ""}`}
                      onClick={() => handleExtruderSelect("kit-doble")}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle>Kit Doble Tracción</CardTitle>
                        <CardDescription>Sistema de doble tracción para mayor precisión</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="relative h-32 w-full mb-4">
                          <Image
                            src="/placeholder.svg?height=150&width=200"
                            alt="Kit Doble Tracción"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Compatibilidad:</span>
                            <span>Ender 3, Ender 3 V2</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Material:</span>
                            <span>Aluminio reforzado</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full text-right">
                          <span className="text-xl font-bold">$19.000</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </div>

                {/* Build Plate Selection */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Selecciona una Placa de Impresión</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card
                      className={`cursor-pointer ${selectedBuildPlate === "pei" ? "ring-2 ring-purple-600" : ""}`}
                      onClick={() => handleBuildPlateSelect("pei")}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle>Placa PEI Magnética</CardTitle>
                        <CardDescription>Excelente adhesión y fácil remoción de piezas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="relative h-32 w-full mb-4">
                          <Image
                            src="/placeholder.svg?height=150&width=200"
                            alt="Placa PEI Magnética"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tamaño:</span>
                            <span>235 x 235 mm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Material:</span>
                            <span>PEI + Base magnética</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full text-right">
                          <span className="text-xl font-bold">$8.500</span>
                        </div>
                      </CardFooter>
                    </Card>

                    <Card
                      className={`cursor-pointer ${selectedBuildPlate === "glass" ? "ring-2 ring-purple-600" : ""}`}
                      onClick={() => handleBuildPlateSelect("glass")}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle>Placa de Vidrio Templado</CardTitle>
                        <CardDescription>Superficie ultra plana para impresiones perfectas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="relative h-32 w-full mb-4">
                          <Image
                            src="/placeholder.svg?height=150&width=200"
                            alt="Placa de Vidrio Templado"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tamaño:</span>
                            <span>235 x 235 mm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Material:</span>
                            <span>Vidrio templado</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="w-full text-right">
                          <span className="text-xl font-bold">$6.000</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Continuar a Apariencia</Button>
                </div>
              </div>
            </TabsContent>

            {/* Appearance Customization */}
            <TabsContent value="appearance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personalización de Apariencia</CardTitle>
                  <CardDescription>Personaliza el aspecto de tu impresora 3D</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Color Selection */}
                  <div className="space-y-4">
                    <Label>Color de la Estructura</Label>
                    <RadioGroup defaultValue="black" className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="black" id="black" />
                        <Label htmlFor="black" className="flex items-center">
                          <div className="w-6 h-6 bg-black rounded-full mr-2"></div>
                          Negro (Estándar)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="blue" id="blue" />
                        <Label htmlFor="blue" className="flex items-center">
                          <div className="w-6 h-6 bg-blue-600 rounded-full mr-2"></div>
                          Azul (+$5.000)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="red" id="red" />
                        <Label htmlFor="red" className="flex items-center">
                          <div className="w-6 h-6 bg-red-600 rounded-full mr-2"></div>
                          Rojo (+$5.000)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="purple" id="purple" />
                        <Label htmlFor="purple" className="flex items-center">
                          <div className="w-6 h-6 bg-purple-600 rounded-full mr-2"></div>
                          Púrpura (+$5.000)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* LED Lighting */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="led-lighting" />
                      <Label htmlFor="led-lighting">Iluminación LED (+$3.500)</Label>
                    </div>
                    <div className="pl-6">
                      <RadioGroup defaultValue="white" className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="white" id="led-white" />
                          <Label htmlFor="led-white">Blanco</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="rgb" id="led-rgb" />
                          <Label htmlFor="led-rgb">RGB (+$1.500)</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Custom Logo */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="custom-logo" />
                      <Label htmlFor="custom-logo">Logo Personalizado (+$2.000)</Label>
                    </div>
                    <div className="pl-6">
                      <Input type="file" accept="image/*" disabled />
                      <p className="text-xs text-muted-foreground mt-1">Formatos aceptados: PNG, JPG (máx. 2MB)</p>
                    </div>
                  </div>

                  {/* Additional Accessories */}
                  <div className="space-y-4">
                    <Label>Accesorios Adicionales</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="tool-kit" />
                        <Label htmlFor="tool-kit">Kit de Herramientas (+$4.500)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="spare-nozzles" />
                        <Label htmlFor="spare-nozzles">Set de Boquillas de Repuesto (+$3.000)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="filament-sample" />
                        <Label htmlFor="filament-sample">Muestras de Filamento PLA (+$5.000)</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Finalizar Personalización</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPrinter && (
                <div className="flex justify-between">
                  <span>{selectedPrinter === "ender3-v2" ? "Creality Ender 3 V2" : "Creality Ender 3"}</span>
                  <span>${selectedPrinter === "ender3-v2" ? "320.000" : "280.000"}</span>
                </div>
              )}

              {selectedExtruder && (
                <div className="flex justify-between">
                  <span>{selectedExtruder === "kit-mejora" ? "Kit Mejora Ender-3" : "Kit Doble Tracción"}</span>
                  <span>${selectedExtruder === "kit-mejora" ? "22.750" : "19.000"}</span>
                </div>
              )}

              {selectedBuildPlate && (
                <div className="flex justify-between">
                  <span>{selectedBuildPlate === "pei" ? "Placa PEI Magnética" : "Placa de Vidrio Templado"}</span>
                  <span>${selectedBuildPlate === "pei" ? "8.500" : "6.000"}</span>
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Agregar al Carrito
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
