"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, Share2, ShoppingCart, Package, Truck, Shield, X } from "lucide-react"
import Image from "next/image"

interface ProductPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    name: string
    price: number
    originalPrice?: number
    description: string
    category: string
    brand: string
    images: string[]
    specifications: Record<string, string>
    features: string[]
    inStock: boolean
    stockQuantity: number
    rating: number
    reviewCount: number
  }
}

export default function ProductPreviewModal({ isOpen, onClose, product }: ProductPreviewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 bg-white/80 hover:bg-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Galería de imágenes */}
            <div className="p-6 bg-gray-50">
              <div className="space-y-4">
                <div className="aspect-square bg-white rounded-lg overflow-hidden">
                  <Image
                    src={product.images[selectedImage] || "/placeholder.svg?height=500&width=500"}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? "border-purple-600" : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image || "/placeholder.svg?height=64&width=64"}
                        alt={`${product.name} ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Información del producto */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{product.category}</Badge>
                    <Badge variant="outline">{product.brand}</Badge>
                    {discount > 0 && <Badge className="bg-red-100 text-red-800 hover:bg-red-100">-{discount}%</Badge>}
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviewCount} reseñas)
                    </span>
                  </div>
                </div>

                {/* Precio */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">${product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Precio en pesos argentinos</p>
                </div>

                {/* Stock */}
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className={`text-sm ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                    {product.inStock ? `En stock (${product.stockQuantity} disponibles)` : "Sin stock"}
                  </span>
                </div>

                {/* Descripción */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                </div>

                {/* Características principales */}
                {product.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Características principales</h3>
                    <ul className="space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-purple-600 mt-1">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Acciones */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                        className="px-3 py-2 hover:bg-gray-50"
                        disabled={!product.inStock}
                      >
                        +
                      </button>
                    </div>
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={!product.inStock}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Agregar al carrito
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Heart className="h-4 w-4 mr-2" />
                      Favoritos
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Share2 className="h-4 w-4 mr-2" />
                      Compartir
                    </Button>
                  </div>
                </div>

                {/* Información de envío */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Truck className="h-4 w-4 text-purple-600" />
                    <span>Envío gratis en compras mayores a $100.000</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-purple-600" />
                    <span>Garantía oficial de 12 meses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs con información adicional */}
          <div className="border-t">
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent">
                <TabsTrigger
                  value="specs"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600"
                >
                  Especificaciones
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600"
                >
                  Envío
                </TabsTrigger>
                <TabsTrigger
                  value="warranty"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600"
                >
                  Garantía
                </TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-700">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Envío Estándar</h4>
                        <p className="text-sm text-gray-600 mb-2">3-5 días hábiles</p>
                        <p className="text-sm font-medium">$5.000</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">Envío Express</h4>
                        <p className="text-sm text-gray-600 mb-2">1-2 días hábiles</p>
                        <p className="text-sm font-medium">$15.000</p>
                      </CardContent>
                    </Card>
                  </div>
                  <p className="text-sm text-gray-600">
                    * Envío gratis en compras mayores a $100.000 para envío estándar
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="warranty" className="p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Garantía Oficial</h4>
                    <p className="text-sm text-gray-600">
                      Este producto cuenta con garantía oficial del fabricante por 12 meses contra defectos de
                      fabricación.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Soporte Técnico</h4>
                    <p className="text-sm text-gray-600">
                      Nuestro equipo de soporte técnico especializado está disponible para ayudarte con cualquier
                      consulta sobre el producto.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
