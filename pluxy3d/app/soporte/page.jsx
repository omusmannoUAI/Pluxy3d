"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Send,
  FileText,
  HelpCircle,
  Wrench,
  Package,
  CreditCard,
  User,
  CheckCircle,
  ExternalLink,
  Download,
  Search,
  Filter,
  Star,
  ThumbsUp,
  MessageSquare,
  Headphones,
  Globe,
  MapPin,
} from "lucide-react"

export default function SoportePage() {
  const [selectedCategory, setSelectedCategory] = useState("general")
  const [searchQuery, setSearchQuery] = useState("")
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    category: "",
    priority: "",
    subject: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Datos de ejemplo para FAQ
  const faqCategories = [
    { id: "general", name: "General", icon: HelpCircle, count: 12 },
    { id: "productos", name: "Productos", icon: Package, count: 8 },
    { id: "pedidos", name: "Pedidos", icon: FileText, count: 15 },
    { id: "pagos", name: "Pagos", icon: CreditCard, count: 6 },
    { id: "tecnico", name: "Soporte Técnico", icon: Wrench, count: 10 },
    { id: "cuenta", name: "Mi Cuenta", icon: User, count: 5 },
  ]

  const faqs = [
    {
      id: 1,
      category: "general",
      question: "¿Cuáles son los horarios de atención?",
      answer: "Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM, y sábados de 9:00 AM a 2:00 PM.",
      helpful: 24,
      views: 156,
    },
    {
      id: 2,
      category: "productos",
      question: "¿Qué garantía tienen las impresoras 3D?",
      answer:
        "Todas nuestras impresoras 3D cuentan con garantía de 12 meses por defectos de fabricación. La garantía cubre piezas y mano de obra.",
      helpful: 18,
      views: 89,
    },
    {
      id: 3,
      category: "pedidos",
      question: "¿Cómo puedo rastrear mi pedido?",
      answer:
        "Puedes rastrear tu pedido ingresando a tu cuenta y visitando la sección 'Mis Pedidos', o usando el número de seguimiento que te enviamos por email.",
      helpful: 32,
      views: 203,
    },
    {
      id: 4,
      category: "pagos",
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos tarjetas de crédito y débito (Visa, MasterCard), transferencias bancarias, y pagos en efectivo contra entrega en algunas zonas.",
      helpful: 15,
      views: 127,
    },
    {
      id: 5,
      category: "tecnico",
      question: "Mi impresora no está imprimiendo correctamente",
      answer:
        "Verifica que la cama esté nivelada, el filamento esté cargado correctamente, y la temperatura sea la adecuada para el material que estás usando.",
      helpful: 28,
      views: 94,
    },
    {
      id: 6,
      category: "cuenta",
      question: "¿Cómo cambio mi contraseña?",
      answer:
        "Ve a 'Mi Cuenta' > 'Configuración' > 'Cambiar Contraseña'. También puedes usar la opción 'Olvidé mi contraseña' en el login.",
      helpful: 12,
      views: 67,
    },
  ]

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = !selectedCategory || faq.category === selectedCategory
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleTicketSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowSuccess(true)
    setTicketForm({
      name: "",
      email: "",
      category: "",
      priority: "",
      subject: "",
      description: "",
    })

    // Ocultar mensaje de éxito después de 5 segundos
    setTimeout(() => setShowSuccess(false), 5000)
  }

  const handleInputChange = (field, value) => {
    setTicketForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Centro de Soporte</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Encuentra respuestas rápidas o contáctanos directamente.
          </p>
        </div>

        {/* Mensaje de éxito */}
        {showSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ¡Tu ticket de soporte ha sido enviado exitosamente! Te responderemos en las próximas 24 horas.
            </AlertDescription>
          </Alert>
        )}

        {/* Opciones de contacto rápido */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Chat en Vivo</h3>
              <p className="text-sm text-muted-foreground mb-4">Habla con nuestro equipo de soporte en tiempo real</p>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                En línea
              </Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Teléfono</h3>
              <p className="text-sm text-muted-foreground mb-2">Llámanos directamente</p>
              <p className="font-mono text-lg">+1 (555) 123-4567</p>
              <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Lun-Vie 9AM-6PM
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground mb-2">Envíanos un correo</p>
              <p className="text-sm">soporte@pluxy3d.com</p>
              <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Respuesta en 24h
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Preguntas Frecuentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Búsqueda y filtros */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar en preguntas frecuentes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {faqCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name} ({category.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Categorías */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {faqCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id === selectedCategory ? "all" : category.id)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          selectedCategory === category.id
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium text-sm">{category.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{category.count} artículos</span>
                      </button>
                    )
                  })}
                </div>

                <Separator />

                {/* Lista de FAQs */}
                <div className="space-y-4">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                      <Card key={faq.id} className="border-l-4 border-l-purple-600">
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-2">{faq.question}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{faq.answer}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {faq.helpful} útil
                              </span>
                              <span>{faq.views} vistas</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              ¿Te ayudó?
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No se encontraron preguntas que coincidan con tu búsqueda.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recursos adicionales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Recursos Adicionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Download className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">Manual de Usuario</p>
                      <p className="text-xs text-muted-foreground">Guía completa de productos</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">Comunidad</p>
                      <p className="text-xs text-muted-foreground">Foro de usuarios</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Headphones className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium text-sm">Tutoriales</p>
                      <p className="text-xs text-muted-foreground">Videos paso a paso</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <Globe className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-sm">Blog Técnico</p>
                      <p className="text-xs text-muted-foreground">Artículos y consejos</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de contacto */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="mr-2 h-5 w-5" />
                  Crear Ticket de Soporte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTicketSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input
                      id="name"
                      value={ticketForm.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={ticketForm.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={ticketForm.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Consulta General</SelectItem>
                        <SelectItem value="productos">Productos</SelectItem>
                        <SelectItem value="pedidos">Pedidos y Envíos</SelectItem>
                        <SelectItem value="pagos">Pagos y Facturación</SelectItem>
                        <SelectItem value="tecnico">Soporte Técnico</SelectItem>
                        <SelectItem value="cuenta">Mi Cuenta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select value={ticketForm.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona prioridad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baja</SelectItem>
                        <SelectItem value="medium">Media</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto *</Label>
                    <Input
                      id="subject"
                      value={ticketForm.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Describe brevemente tu consulta"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      value={ticketForm.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe tu problema o consulta en detalle..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Ticket
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Información de contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Dirección</p>
                      <p className="text-sm text-muted-foreground">
                        Av. Tecnología 123
                        <br />
                        Ciudad Tech, CT 12345
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Teléfono</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Email</p>
                      <p className="text-sm text-muted-foreground">soporte@pluxy3d.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Horarios</p>
                      <p className="text-sm text-muted-foreground">
                        Lun-Vie: 9:00 AM - 6:00 PM
                        <br />
                        Sáb: 9:00 AM - 2:00 PM
                        <br />
                        Dom: Cerrado
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">¿Necesitas ayuda inmediata?</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Iniciar Chat en Vivo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Valoración del servicio */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  Califica Nuestro Servicio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Tu opinión nos ayuda a mejorar</p>
                  <div className="flex justify-center gap-2">
                    {Array(5)
                      .fill()
                      .map((_, i) => (
                        <button key={i} className="p-1 hover:scale-110 transition-transform">
                          <Star className="h-6 w-6 text-gray-300 hover:text-yellow-500" />
                        </button>
                      ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Enviar Valoración
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
