"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Printer, Wrench, Palette } from "lucide-react"
import Image from "next/image"
import { OrderSummary } from "@/components/shared/OrderSummary"
import { useCart } from "@/contexts/CartContext"
import { useRouter } from "next/navigation"
import { usePersonalizacion } from "@/hooks/usePersonalizacion"

export default function PersonalizacionContent() {
  const {
    selectedPrinter,
    selectedExtruder,
    selectedBuildPlate,
    activeTab,
    appearance,
    setActiveTab,
    handlePrinterSelect,
    handleExtruderSelect,
    handleBuildPlateSelect,
    updateAppearance,
    updateAccessories,
    orderItems,
    orderTotal,
  } = usePersonalizacion()

  const { addCustomItem } = useCart()
  const router = useRouter()

  const addBuildToCart = () => {
    const summary = orderItems.map(i => i.name).join(" + ")
    const name = selectedPrinter ? `Build ${selectedPrinter.toUpperCase()}` : 'Build personalizado'
    addCustomItem({
      name,
      description: summary,
      price: orderTotal,
      image: "/placeholder.svg",
      quantity: 1,
    })
    router.push('/carrito')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Personalización de Impresora</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
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
                <Button
                  variant="purple"
                  className="w-full"
                  disabled={!selectedPrinter}
                  onClick={() => setActiveTab("components")}
                >
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
                  <Button variant="purple" className="w-full" onClick={() => setActiveTab("appearance")}>
                    Continuar a Apariencia
                  </Button>
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
                    <RadioGroup
                      value={appearance.color}
                      onValueChange={(v) => updateAppearance({ color: v as any })}
                      className="flex flex-wrap gap-4"
                    >
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
                      <Checkbox
                        id="led-lighting"
                        checked={appearance.led}
                        onCheckedChange={(v) => updateAppearance({ led: Boolean(v) })}
                      />
                      <Label htmlFor="led-lighting">Iluminación LED (+$3.500)</Label>
                    </div>
                    <div className="pl-6">
                      <RadioGroup
                        value={appearance.ledType}
                        onValueChange={(v) => updateAppearance({ ledType: v as any })}
                        className="flex flex-wrap gap-4"
                      >
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
                      <Checkbox
                        id="custom-logo"
                        checked={appearance.logo}
                        onCheckedChange={(v) => updateAppearance({ logo: Boolean(v) })}
                      />
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
                        <Checkbox
                          id="tool-kit"
                          checked={appearance.accessories.toolkit}
                          onCheckedChange={(v) => updateAccessories('toolkit', Boolean(v))}
                        />
                        <Label htmlFor="tool-kit">Kit de Herramientas (+$4.500)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="spare-nozzles"
                          checked={appearance.accessories.nozzles}
                          onCheckedChange={(v) => updateAccessories('nozzles', Boolean(v))}
                        />
                        <Label htmlFor="spare-nozzles">Set de Boquillas de Repuesto (+$3.000)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="filament-sample"
                          checked={appearance.accessories.filamentSample}
                          onCheckedChange={(v) => updateAccessories('filamentSample', Boolean(v))}
                        />
                        <Label htmlFor="filament-sample">Muestras de Filamento PLA (+$5.000)</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="purple" className="w-full" onClick={addBuildToCart}>
                    Finalizar Personalización
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary
            items={orderItems}
            total={orderTotal}
            showCheckoutButton={true}
            checkoutLabel="Agregar al Carrito"
            onCheckout={addBuildToCart}
            className="sticky top-20"
          />
        </div>
      </div>
    </div>
  )
}
