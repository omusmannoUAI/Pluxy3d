"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  MapPin,
  CreditCard,
  Package,
  Settings,
  LogOut,
  Edit,
  Plus,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const { user, logout, updateUser, loading } = useAuth()
  const router = useRouter()

  /**
   * @type {[string, Function]} Tab activa
   */
  const [activeTab, setActiveTab] = useState("profile")

  /**
   * @type {[Object, Function]} Datos del formulario de perfil
   */
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  /**
   * @type {[string|null, Function]} Mensaje de éxito
   */
  const [success, setSuccess] = useState(null)

  /**
   * @type {[string|null, Function]} Mensaje de error
   */
  const [error, setError] = useState(null)

  // Datos de ejemplo para pedidos
  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "delivered",
      total: 389099,
      items: [
        {
          name: "Kit Mejora Ender-3",
          quantity: 1,
          price: 22750,
        },
        {
          name: "Impresora Creality Ender-3 V2",
          quantity: 1,
          price: 366349,
        },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-01-20",
      status: "processing",
      total: 45000,
      items: [
        {
          name: "Filamento PLA 1.75mm",
          quantity: 2,
          price: 22500,
        },
      ],
    },
    {
      id: "ORD-003",
      date: "2024-01-25",
      status: "shipped",
      total: 125000,
      items: [
        {
          name: "Kit Doble Tracción",
          quantity: 1,
          price: 19000,
        },
        {
          name: "Placa de Impresión Magnética",
          quantity: 1,
          price: 35000,
        },
      ],
    },
  ]

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Cargar datos del usuario en el formulario
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  /**
   * Manejar cambios en el formulario de perfil
   * @param {Event} e - Evento del input
   */
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      [name]: value,
    })
  }

  /**
   * Guardar cambios del perfil
   * @param {Event} e - Evento del formulario
   */
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const result = await updateUser(profileData)

    if (result.success) {
      setSuccess("Perfil actualizado correctamente")
      setTimeout(() => setSuccess(null), 3000)
    } else {
      setError(result.message || "Error al actualizar el perfil")
    }
  }

  /**
   * Cerrar sesión
   */
  const handleLogout = () => {
    logout()
    router.push("/")
  }

  /**
   * Obtener el color del badge según el estado del pedido
   * @param {string} status - Estado del pedido
   * @returns {string} Clase CSS para el color
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "shipped":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "processing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  /**
   * Obtener el texto del estado del pedido
   * @param {string} status - Estado del pedido
   * @returns {string} Texto del estado
   */
  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Entregado"
      case "shipped":
        return "Enviado"
      case "processing":
        return "Procesando"
      case "cancelled":
        return "Cancelado"
      default:
        return "Desconocido"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // El useEffect se encargará de la redirección
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Image
                  src={user.avatar || "/placeholder.svg?height=80&width=80"}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Button
                  variant={activeTab === "profile" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </Button>
                <Button
                  variant={activeTab === "orders" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("orders")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Mis Pedidos
                </Button>
                <Button
                  variant={activeTab === "addresses" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("addresses")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Direcciones
                </Button>
                <Button
                  variant={activeTab === "payment" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("payment")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Métodos de Pago
                </Button>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </Button>
              </nav>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Éxito</AlertTitle>
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          {/* Mi Perfil */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Mi Perfil</CardTitle>
                <CardDescription>Actualiza tu información personal</CardDescription>
              </CardHeader>
              <form onSubmit={handleSaveProfile}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={loading}>
                    Guardar Cambios
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* Mis Pedidos */}
          {activeTab === "orders" && (
            <Card>
              <CardHeader>
                <CardTitle>Mis Pedidos</CardTitle>
                <CardDescription>Historial de tus compras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                          <h3 className="font-medium">Pedido #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            Fecha: {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                          <span className="font-bold">${order.total.toLocaleString("es-AR")}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>
                              {item.name} x{item.quantity}
                            </span>
                            <span>${(item.price * item.quantity).toLocaleString("es-AR")}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-3 w-3" />
                          Ver Detalles
                        </Button>
                        {order.status === "delivered" && (
                          <Button variant="outline" size="sm">
                            Volver a Comprar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Direcciones */}
          {activeTab === "addresses" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Direcciones</CardTitle>
                    <CardDescription>Gestiona tus direcciones de envío</CardDescription>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Dirección
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {user.addresses && user.addresses.length > 0 ? (
                  <div className="space-y-4">
                    {user.addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{address.name}</h3>
                              {address.isDefault && (
                                <Badge variant="outline" className="text-xs">
                                  Predeterminada
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{address.address}</p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state}, {address.zipCode}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No tienes direcciones guardadas</p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Primera Dirección
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Métodos de Pago */}
          {activeTab === "payment" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Métodos de Pago</CardTitle>
                    <CardDescription>Gestiona tus tarjetas y métodos de pago</CardDescription>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Tarjeta
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {user.paymentMethods && user.paymentMethods.length > 0 ? (
                  <div className="space-y-4">
                    {user.paymentMethods.map((method) => (
                      <div key={method.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs font-bold">{method.brand}</span>
                            </div>
                            <div>
                              <p className="font-medium">•••• •••• •••• {method.last4}</p>
                              <p className="text-sm text-muted-foreground">
                                Vence {method.expiryMonth}/{method.expiryYear}
                              </p>
                            </div>
                            {method.isDefault && (
                              <Badge variant="outline" className="text-xs">
                                Predeterminada
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No tienes métodos de pago guardados</p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Primera Tarjeta
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Configuración */}
          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>Preferencias de cuenta y notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Notificaciones por Email</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Confirmaciones de pedido</p>
                        <p className="text-sm text-muted-foreground">Recibe emails cuando realices un pedido</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Actualizaciones de envío</p>
                        <p className="text-sm text-muted-foreground">Notificaciones sobre el estado de tus envíos</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Ofertas y promociones</p>
                        <p className="text-sm text-muted-foreground">Recibe ofertas especiales y descuentos</p>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Seguridad</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Cambiar Contraseña
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      Configurar Autenticación de Dos Factores
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4 text-red-600">Zona Peligrosa</h3>
                  <Button variant="destructive" className="w-full">
                    Eliminar Cuenta
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
