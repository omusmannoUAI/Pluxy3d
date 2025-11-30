"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, CreditCard, Truck, MapPin, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/contexts/CartContext"
import { createOrder } from "@/services/api"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()

  /**
   * @type {[string, Function]} Paso actual del checkout
   */
  const [step, setStep] = useState("shipping")

  /**
   * @type {[Object, Function]} Datos del formulario de envío
   */
  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    saveInfo: true,
  })

  /**
   * @type {[string, Function]} Método de envío seleccionado
   */
  const [shippingMethod, setShippingMethod] = useState("standard")

  /**
   * @type {[Object, Function]} Datos del formulario de pago
   */
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  })

  /**
   * @type {[string, Function]} Método de pago seleccionado
   */
  const [paymentMethod, setPaymentMethod] = useState("credit_card")

  /**
   * @type {[boolean, Function]} Estado de carga
   */
  const [loading, setLoading] = useState(false)

  /**
   * @type {[string|null, Function]} Mensaje de error
   */
  const [error, setError] = useState(null)

  /**
   * @type {[boolean, Function]} Estado de éxito
   */
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (cart.length === 0 && !success) {
      router.push("/carrito")
    }
  }, [cart, success, router])

  /**
   * @type {Array} Productos en el carrito
   */
  const cartItems = cart

  // Cálculos del pedido
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const discount = cartItems.reduce(
    (total, item) => total + (item.originalPrice && item.originalPrice > item.price ? (item.originalPrice - item.price) * item.quantity : 0),
    0,
  )
  const shippingCost = shippingMethod === "express" ? 15000 : shippingMethod === "standard" ? 5000 : 0
  const tax = Math.round(subtotal * 0.19) // IVA 19%
  const total = subtotal + shippingCost + tax

  /**
   * Actualizar datos del formulario de envío
   * @param {Event} e - Evento del input
   */
  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target
    setShippingData({
      ...shippingData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  /**
   * Actualizar datos del formulario de pago
   * @param {Event} e - Evento del input
   */
  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target
    setPaymentData({
      ...paymentData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  /**
   * Validar formulario de envío
   * @returns {boolean} Si el formulario es válido
   */
  const validateShippingForm = () => {
    // Validación básica
    if (
      !shippingData.firstName ||
      !shippingData.lastName ||
      !shippingData.email ||
      !shippingData.phone ||
      !shippingData.address ||
      !shippingData.city ||
      !shippingData.state ||
      !shippingData.zipCode
    ) {
      setError("Por favor, completa todos los campos obligatorios.")
      return false
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(shippingData.email)) {
      setError("Por favor, ingresa un correo electrónico válido.")
      return false
    }

    setError(null)
    return true
  }

  /**
   * Validar formulario de pago
   * @returns {boolean} Si el formulario es válido
   */
  const validatePaymentForm = () => {
    if (paymentMethod === "credit_card") {
      // Validación básica para tarjeta de crédito
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
        setError("Por favor, completa todos los campos de la tarjeta.")
        return false
      }

      // Validación de número de tarjeta (simplificada)
      if (paymentData.cardNumber.replace(/\s/g, "").length !== 16) {
        setError("El número de tarjeta debe tener 16 dígitos.")
        return false
      }

      // Validación de CVV
      if (paymentData.cvv.length < 3 || paymentData.cvv.length > 4) {
        setError("El código de seguridad debe tener 3 o 4 dígitos.")
        return false
      }
    }

    setError(null)
    return true
  }

  /**
   * Avanzar al siguiente paso
   */
  const handleNextStep = () => {
    if (step === "shipping") {
      if (validateShippingForm()) {
        setStep("payment")
      }
    } else if (step === "payment") {
      if (validatePaymentForm()) {
        setStep("review")
      }
    }
  }

  /**
   * Volver al paso anterior
   */
  const handlePreviousStep = () => {
    if (step === "payment") {
      setStep("shipping")
    } else if (step === "review") {
      setStep("payment")
    }
  }

  /**
   * Finalizar compra
   */
  const handlePlaceOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      // Preparar items con soporte para múltiples convenciones de nombres (inglés/español, camelCase/PascalCase)
      const itemsMapped = cartItems.map(item => ({
        productId: Number(item.id),
        quantity: Number(item.quantity),
        price: Number(item.price),
        // Soporte para backend en español
        productoId: Number(item.id),
        cantidad: Number(item.quantity),
        precio: Number(item.price),
        // Soporte para PascalCase
        ProductId: Number(item.id),
        Quantity: Number(item.quantity),
        Price: Number(item.price)
      }))

      const orderData = {
        items: itemsMapped,
        Items: itemsMapped, // Soporte para PascalCase
        shipping: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          email: shippingData.email,
          phone: shippingData.phone,
          address: shippingData.apartment 
            ? `${shippingData.address}, ${shippingData.apartment}` 
            : shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          method: shippingMethod,
          cost: shippingCost,
          // Soporte para backend en español
          nombre: shippingData.firstName,
          apellido: shippingData.lastName,
          telefono: shippingData.phone,
          direccion: shippingData.apartment 
            ? `${shippingData.address}, ${shippingData.apartment}` 
            : shippingData.address,
          ciudad: shippingData.city,
          provincia: shippingData.state,
          codigoPostal: shippingData.zipCode,
          metodo: shippingMethod,
          costo: shippingCost
        },
        payment: {
          method: paymentMethod,
          details: paymentMethod === 'credit_card' ? {
            cardLast4: paymentData.cardNumber.slice(-4),
            cardName: paymentData.cardName
          } : {},
          // Soporte para backend en español
          metodo: paymentMethod,
          detalles: paymentMethod === 'credit_card' ? {
            cardLast4: paymentData.cardNumber.slice(-4),
            cardName: paymentData.cardName
          } : {}
        },
        totals: {
          subtotal,
          discount,
          tax,
          total
        },
        date: new Date().toISOString()
      }

      console.log("Enviando orden:", orderData) // Para depuración

      await createOrder(orderData)

      // Simulamos éxito
      setSuccess(true)

      // Limpiar carrito
      clearCart()
    } catch (err) {
      console.error("Error al procesar el pedido:", err)
      setError("Ocurrió un error al procesar tu pedido. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  // Si el pedido fue exitoso, mostrar página de confirmación
  if (success) {
    return <OrderConfirmation total={total} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/carrito">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Carrito
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Tabs value={step} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="shipping"
                  onClick={() => step !== "shipping" && validateShippingForm() && setStep("shipping")}
                  disabled={loading}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Envío
                </TabsTrigger>
                <TabsTrigger
                  value="payment"
                  onClick={() => {
                    if (step === "shipping") {
                      validateShippingForm() && setStep("payment")
                    } else if (step === "review") {
                      setStep("payment")
                    }
                  }}
                  disabled={loading}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pago
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  onClick={() => {
                    if (step === "payment") {
                      validatePaymentForm() && setStep("review")
                    }
                  }}
                  disabled={loading}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Revisión
                </TabsTrigger>
              </TabsList>

              {/* Formulario de Envío */}
              <TabsContent value="shipping" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información de Envío</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">
                          Nombre <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={shippingData.firstName}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">
                          Apellido <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={shippingData.lastName}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingData.email}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          Teléfono <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={shippingData.phone}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">
                        Dirección <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingData.address}
                        onChange={handleShippingChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apartment">Apartamento, suite, etc. (opcional)</Label>
                      <Input
                        id="apartment"
                        name="apartment"
                        value={shippingData.apartment}
                        onChange={handleShippingChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">
                          Ciudad <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingData.city}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">
                          Provincia/Estado <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={shippingData.state}
                          onValueChange={(value) => setShippingData({ ...shippingData, state: value })}
                        >
                          <SelectTrigger id="state">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buenosaires">Buenos Aires</SelectItem>
                            <SelectItem value="caba">CABA</SelectItem>
                            <SelectItem value="catamarca">Catamarca</SelectItem>
                            <SelectItem value="chaco">Chaco</SelectItem>
                            <SelectItem value="chubut">Chubut</SelectItem>
                            <SelectItem value="cordoba">Córdoba</SelectItem>
                            <SelectItem value="corrientes">Corrientes</SelectItem>
                            <SelectItem value="entrerios">Entre Ríos</SelectItem>
                            <SelectItem value="formosa">Formosa</SelectItem>
                            <SelectItem value="jujuy">Jujuy</SelectItem>
                            <SelectItem value="lapampa">La Pampa</SelectItem>
                            <SelectItem value="larioja">La Rioja</SelectItem>
                            <SelectItem value="mendoza">Mendoza</SelectItem>
                            <SelectItem value="misiones">Misiones</SelectItem>
                            <SelectItem value="neuquen">Neuquén</SelectItem>
                            <SelectItem value="rionegro">Río Negro</SelectItem>
                            <SelectItem value="salta">Salta</SelectItem>
                            <SelectItem value="sanjuan">San Juan</SelectItem>
                            <SelectItem value="sanluis">San Luis</SelectItem>
                            <SelectItem value="santacruz">Santa Cruz</SelectItem>
                            <SelectItem value="santafe">Santa Fe</SelectItem>
                            <SelectItem value="santiago">Santiago del Estero</SelectItem>
                            <SelectItem value="tierradelfuego">Tierra del Fuego</SelectItem>
                            <SelectItem value="tucuman">Tucumán</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">
                          Código Postal <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={shippingData.zipCode}
                          onChange={handleShippingChange}
                          required
                        />
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4">
                      <h3 className="font-medium">Método de Envío</h3>
                      <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-2">
                        <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id="standard" />
                            <Label htmlFor="standard" className="font-normal cursor-pointer">
                              Envío Estándar (3-5 días hábiles)
                            </Label>
                          </div>
                          <div className="font-medium">$5.000</div>
                        </div>
                        <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="express" id="express" />
                            <Label htmlFor="express" className="font-normal cursor-pointer">
                              Envío Express (1-2 días hábiles)
                            </Label>
                          </div>
                          <div className="font-medium">$15.000</div>
                        </div>
                        <div className="flex items-center justify-between space-x-2 border p-4 rounded-md">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pickup" id="pickup" />
                            <Label htmlFor="pickup" className="font-normal cursor-pointer">
                              Retiro en Tienda (Gratis)
                            </Label>
                          </div>
                          <div className="font-medium">$0</div>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href="/carrito">Volver al Carrito</Link>
                    </Button>
                    <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700">
                      Continuar a Pago
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Formulario de Pago */}
              <TabsContent value="payment" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información de Pago</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <h3 className="font-medium">Método de Pago</h3>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-2">
                        <div className="flex items-center space-x-2 border p-4 rounded-md">
                          <RadioGroupItem value="credit_card" id="credit_card" />
                          <Label htmlFor="credit_card" className="font-normal cursor-pointer flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Tarjeta de Crédito/Débito
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-4 rounded-md">
                          <RadioGroupItem value="mercadopago" id="mercadopago" />
                          <Label htmlFor="mercadopago" className="font-normal cursor-pointer">
                            MercadoPago
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-4 rounded-md">
                          <RadioGroupItem value="transfer" id="transfer" />
                          <Label htmlFor="transfer" className="font-normal cursor-pointer">
                            Transferencia Bancaria
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {paymentMethod === "credit_card" && (
                      <div className="space-y-4 mt-6">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">
                            Número de Tarjeta <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentData.cardNumber}
                            onChange={handlePaymentChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardName">
                            Nombre en la Tarjeta <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="cardName"
                            name="cardName"
                            placeholder="NOMBRE APELLIDO"
                            value={paymentData.cardName}
                            onChange={handlePaymentChange}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">
                              Fecha de Vencimiento <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/AA"
                              value={paymentData.expiryDate}
                              onChange={handlePaymentChange}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">
                              Código de Seguridad <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              placeholder="123"
                              value={paymentData.cvv}
                              onChange={handlePaymentChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <input
                            type="checkbox"
                            id="saveCard"
                            name="saveCard"
                            checked={paymentData.saveCard}
                            onChange={handlePaymentChange}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <Label htmlFor="saveCard" className="font-normal cursor-pointer">
                            Guardar esta tarjeta para futuras compras
                          </Label>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "mercadopago" && (
                      <div className="p-4 bg-blue-50 rounded-md mt-4">
                        <p>Serás redirigido a MercadoPago para completar el pago después de revisar tu pedido.</p>
                      </div>
                    )}

                    {paymentMethod === "transfer" && (
                      <div className="p-4 bg-gray-50 rounded-md mt-4 space-y-2">
                        <p className="font-medium">Datos para transferencia:</p>
                        <p>Banco: Banco Nación</p>
                        <p>Titular: Pluxy 3D S.R.L.</p>
                        <p>CUIT: 30-12345678-9</p>
                        <p>CBU: 0110000000000000000000</p>
                        <p>Alias: PLUXY.3D.VENTAS</p>
                        <p className="mt-4 text-sm text-muted-foreground">
                          Importante: Tu pedido será procesado una vez que confirmemos el pago. Por favor envía el
                          comprobante a pagos@pluxy3d.com
                        </p>
                      </div>
                    )}

                    <div className="flex items-center p-4 bg-green-50 rounded-md mt-4">
                      <ShieldCheck className="h-5 w-5 text-green-600 mr-2" />
                      <p className="text-sm text-green-700">
                        Tus datos de pago están protegidos con encriptación de 256 bits.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousStep}>
                      Volver a Envío
                    </Button>
                    <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700">
                      Revisar Pedido
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Revisión del Pedido */}
              <TabsContent value="review" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revisar y Confirmar Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Resumen de Envío */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Información de Envío</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setStep("shipping")}
                          className="h-8 text-purple-600"
                        >
                          Editar
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p>
                          {shippingData.firstName} {shippingData.lastName}
                        </p>
                        <p>{shippingData.address}</p>
                        {shippingData.apartment && <p>{shippingData.apartment}</p>}
                        <p>
                          {shippingData.city}, {shippingData.state}, {shippingData.zipCode}
                        </p>
                        <p>{shippingData.email}</p>
                        <p>{shippingData.phone}</p>
                        <Separator className="my-2" />
                        <p className="font-medium">
                          Método de envío:{" "}
                          {shippingMethod === "standard"
                            ? "Envío Estándar (3-5 días hábiles)"
                            : shippingMethod === "express"
                              ? "Envío Express (1-2 días hábiles)"
                              : "Retiro en Tienda"}
                        </p>
                      </div>
                    </div>

                    {/* Resumen de Pago */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Información de Pago</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setStep("payment")}
                          className="h-8 text-purple-600"
                        >
                          Editar
                        </Button>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {paymentMethod === "credit_card" && (
                          <div>
                            <p className="font-medium">Tarjeta de Crédito/Débito</p>
                            <p>Terminada en {paymentData.cardNumber.slice(-4)}</p>
                            <p>{paymentData.cardName}</p>
                            <p>Vence: {paymentData.expiryDate}</p>
                          </div>
                        )}
                        {paymentMethod === "mercadopago" && <p className="font-medium">MercadoPago</p>}
                        {paymentMethod === "transfer" && <p className="font-medium">Transferencia Bancaria</p>}
                      </div>
                    </div>

                    {/* Resumen de Productos */}
                    <div>
                      <h3 className="font-medium mb-2">Productos</h3>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-4 border-b pb-4">
                            <div className="relative w-16 h-16">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name || "Producto"}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${(item.price * item.quantity).toLocaleString("es-AR")}</p>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <p className="text-sm text-green-600">
                                  Ahorro: $
                                  {((item.originalPrice - item.price) * item.quantity).toLocaleString("es-AR")}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notas del Pedido */}
                    <div className="space-y-2">
                      <Label htmlFor="orderNotes">Notas del Pedido (opcional)</Label>
                      <Textarea
                        id="orderNotes"
                        placeholder="Instrucciones especiales para la entrega, etc."
                        className="resize-none"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePreviousStep}>
                      Volver a Pago
                    </Button>
                    <Button onClick={handlePlaceOrder} className="bg-purple-600 hover:bg-purple-700" disabled={loading}>
                      {loading ? "Procesando..." : "Confirmar Pedido"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Resumen del Pedido */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name.length > 25 ? item.name.substring(0, 25) + "..." : item.name} x{item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toLocaleString("es-AR")}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toLocaleString("es-AR")}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-${discount.toLocaleString("es-AR")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span>{shippingCost === 0 ? "Gratis" : `$${shippingCost.toLocaleString("es-AR")}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA (19%)</span>
                  <span>${tax.toLocaleString("es-AR")}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toLocaleString("es-AR")}</span>
              </div>

              <div className="pt-4 text-sm text-muted-foreground">
                <p>
                  Al realizar tu pedido, aceptas nuestros{" "}
                  <Link href="/terminos" className="text-purple-600 hover:underline">
                    Términos y Condiciones
                  </Link>{" "}
                  y{" "}
                  <Link href="/privacidad" className="text-purple-600 hover:underline">
                    Política de Privacidad
                  </Link>
                  .
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Pago Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Envío Rápido</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Garantía de Calidad</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Componente de confirmación de pedido
 * @param {Object} props - Propiedades del componente
 * @param {number} props.total - Total del pedido
 */
function OrderConfirmation({ total }) {
  const orderNumber = Math.floor(100000 + Math.random() * 900000) // Número de pedido aleatorio para demo

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
        <p className="text-xl mb-8">Tu pedido ha sido recibido y está siendo procesado.</p>

        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Número de Pedido:</span>
            <span>#{orderNumber}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-medium">Fecha:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total:</span>
            <span>${total.toLocaleString("es-AR")}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Método de Pago:</span>
            <span>Tarjeta de Crédito</span>
          </div>
        </div>

        <p className="mb-6">
          Hemos enviado un correo electrónico de confirmación con los detalles de tu pedido. Puedes seguir el estado de
          tu pedido en tu cuenta.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/cuenta/pedidos">Ver Mis Pedidos</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Volver a la Tienda</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
