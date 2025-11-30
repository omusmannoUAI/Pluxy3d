"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Truck, Shield, Headphones, ChevronLeft, ChevronRight } from "lucide-react"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      title: "Impresoras 3D de Alta Calidad",
      subtitle: "Descubre nuestra selección de impresoras 3D profesionales",
      image: "/images/hero-printer-1.jpg",
      cta: "Ver Impresoras",
      link: "/productos?category=impresoras",
    },
    {
      title: "Componentes y Repuestos",
      subtitle: "Todo lo que necesitas para mejorar tu impresora 3D",
      image: "/images/hero-components.jpg",
      cta: "Ver Componentes",
      link: "/productos?category=componentes",
    },
    {
      title: "Servicio Técnico Especializado",
      subtitle: "Soporte profesional para todas tus necesidades",
      image: "/images/hero-service.jpg",
      cta: "Contactar Soporte",
      link: "/soporte",
    },
  ]

  const featuredProducts = [
    {
      id: 1,
      name: "Creality Ender 3 V2",
      price: 320000,
      originalPrice: 380000,
      image: "/images/products/ender3-v2.jpg",
      rating: 4.8,
      reviews: 234,
      badge: "Más Vendido",
      badgeColor: "bg-green-500",
    },
    {
      id: 2,
      name: "Kit Mejora Ender-3 Pro",
      price: 22750,
      originalPrice: 32500,
      image: "/images/products/upgrade-kit.jpg",
      rating: 4.6,
      reviews: 189,
      badge: "Oferta",
      badgeColor: "bg-red-500",
    },
    {
      id: 3,
      name: "Hellbot Magna 2",
      price: 450000,
      originalPrice: 520000,
      image: "/images/products/hellbot-magna2.jpg",
      rating: 4.9,
      reviews: 67,
      badge: "Premium",
      badgeColor: "bg-purple-500",
    },
    {
      id: 4,
      name: "Filamento PLA Premium",
      price: 15000,
      originalPrice: 18000,
      image: "/images/products/pla-filament.jpg",
      rating: 4.7,
      reviews: 456,
      badge: "Eco-Friendly",
      badgeColor: "bg-green-500",
    },
  ]

  const categories = [
    {
      name: "Impresoras 3D",
      description: "Desde principiantes hasta profesionales",
      image: "/images/categories/printers.jpg",
      link: "/productos?category=impresoras",
      productCount: 45,
    },
    {
      name: "Componentes",
      description: "Repuestos y mejoras para tu impresora",
      image: "/images/categories/components.jpg",
      link: "/productos?category=componentes",
      productCount: 78,
    },
    {
      name: "Filamentos",
      description: "Materiales de alta calidad",
      image: "/images/categories/filaments.jpg",
      link: "/productos?category=filamentos",
      productCount: 23,
    },
    {
      name: "Accesorios",
      description: "Todo lo que necesitas para imprimir",
      image: "/images/categories/accessories.jpg",
      link: "/productos?category=accesorios",
      productCount: 34,
    },
  ]

  const testimonials = [
    {
      name: "María González",
      role: "Diseñadora Industrial",
      image: "/images/testimonials/maria.jpg",
      rating: 5,
      comment: "Excelente servicio y productos de calidad. Mi Ender 3 funciona perfectamente después de 6 meses.",
    },
    {
      name: "Carlos Rodríguez",
      role: "Ingeniero",
      image: "/images/testimonials/carlos.jpg",
      rating: 5,
      comment: "El soporte técnico es increíble. Me ayudaron a resolver todos mis problemas rápidamente.",
    },
    {
      name: "Ana Martínez",
      role: "Arquitecta",
      image: "/images/testimonials/ana.jpg",
      rating: 5,
      comment: "Los componentes de mejora transformaron completamente mi impresora. Muy recomendado.",
    },
  ]

  // Auto-slide del hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section con Carousel */}
      <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image || "/placeholder.svg"}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">{heroSlides[currentSlide].subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href={heroSlides[currentSlide].link}>
                    {heroSlides[currentSlide].cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-black bg-transparent"
                >
                  <Link href="/soporte">Soporte Técnico</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Envío Gratis</h3>
              <p className="text-gray-600">En compras superiores a $100.000</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Garantía Extendida</h3>
              <p className="text-gray-600">12 meses de garantía en todos los productos</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
              <p className="text-gray-600">Asistencia técnica especializada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Productos Destacados</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra selección de productos más populares y mejor valorados por nuestros clientes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="relative">
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Badge className={`absolute top-2 left-2 ${product.badgeColor} text-white`}>{product.badge}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {Array(5)
                        .fill()
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-purple-600">${product.price.toLocaleString("es-AR")}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ${product.originalPrice.toLocaleString("es-AR")}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link href={`/productos/${product.id}`}>Ver Producto</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/productos">
                Ver Todos los Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explora por Categorías</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Encuentra exactamente lo que necesitas navegando por nuestras categorías especializadas
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={index} href={category.link}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.productCount} productos</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Lo que Dicen Nuestros Clientes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Miles de clientes satisfechos confían en nosotros para sus proyectos de impresión 3D
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 relative mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex justify-center mb-4">
                    {Array(testimonial.rating)
                      .fill()
                      .map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Mantente Actualizado</h2>
          <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter y recibe las últimas novedades, ofertas especiales y consejos de impresión
            3D
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8">Suscribirse</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
