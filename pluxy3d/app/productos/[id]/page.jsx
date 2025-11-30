"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Heart, Truck, ArrowLeft, AlertCircle, Star, Check } from "lucide-react"
import { getProductById, getProducts } from "@/services/api"
import { useCart } from "@/contexts/CartContext"

/**
 * @typedef {Object} ProductDetailPageProps
 * @property {Object} params - Parámetros de la ruta
 * @property {string} params.id - ID del producto
 */

/**
 * Página de detalle de producto
 * @param {ProductDetailPageProps} props - Propiedades del componente
 */
export default function ProductDetailPage({ params }) {
  const { id } = use(params)
  const { addToCart } = useCart()

  /**
   * @type {[Object|null, Function]} producto y función para actualizarlo
   */
  const [product, setProduct] = useState(null)

  /**
   * @type {[boolean, Function]} estado de carga
   */
  const [loading, setLoading] = useState(true)

  /**
   * @type {[string|null, Function]} mensaje de error
   */
  const [error, setError] = useState(null)

  /**
   * @type {[number, Function]} cantidad seleccionada
   */
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        // Primero intentar obtener de la API, si falla usar datos mock
        let productData
        try {
          productData = await getProductById(id)
        } catch (apiError) {
          console.warn("API no disponible, usando datos de ejemplo")
          // Si falla la API, buscar en los productos mock
          const mockProducts = await getProducts()
          productData = mockProducts.find((p) => p.id.toString() === id.toString())

          if (!productData) {
            throw new Error("Producto no encontrado")
          }
        }

        setProduct(productData)
      } catch (err) {
        console.error(`Error al cargar el producto con ID ${id}:`, err)
        setError("No se pudo cargar el producto. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  /**
   * Manejar cambio de cantidad
   * @param {Event} e - Evento del input
   */
  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  /**
   * Manejar agregar al carrito
   */
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
    }
  }

  if (loading) {
    return <ProductDetailSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link href="/productos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Productos
          </Link>
        </Button>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Producto no encontrado</AlertTitle>
          <AlertDescription>El producto que buscas no existe o ha sido eliminado.</AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link href="/productos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Productos
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/productos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Productos
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imágenes del producto */}
        <div>
          <div className="relative h-[400px] w-full mb-4 border rounded-lg overflow-hidden">
            <Image
              src={product.imageUrl || "/placeholder.svg?height=400&width=400"}
              alt={product.name || "Producto"}
              fill
              className="object-contain"
            />
          </div>

          {/* Miniaturas de imágenes adicionales */}
          {product.additionalImages && product.additionalImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {product.additionalImages.map((img, index) => (
                <div key={index} className="relative h-20 border rounded cursor-pointer hover:border-purple-600">
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${product.name || "Producto"} - imagen ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{product.categoryName}</Badge>
              <Badge variant="outline">{product.brandName}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {/* Valoraciones */}
            <div className="flex items-center gap-1 mb-4">
              {Array(5)
                .fill()
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              <span className="text-sm text-muted-foreground ml-2">
                {product.rating} ({product.reviewCount} reseñas)
              </span>
            </div>

            {/* Precio */}
            <div className="mb-4">
              {product.originalPrice && product.originalPrice > product.price ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through text-muted-foreground">
                    ${product.originalPrice.toLocaleString("es-AR")}
                  </span>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </Badge>
                </div>
              ) : null}
              <div className="text-3xl font-bold">${product.price.toLocaleString("es-AR")}</div>
            </div>

            {/* Disponibilidad */}
            <div className="flex items-center gap-2 mb-4">
              {product.inStock ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <Check className="mr-1 h-3 w-3" /> En stock
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-500">
                  Agotado
                </Badge>
              )}

              {product.freeShipping && (
                <Badge variant="outline" className="flex items-center">
                  <Truck className="mr-1 h-3 w-3" /> Envío gratis
                </Badge>
              )}
            </div>

            {/* Descripción corta */}
            <p className="text-muted-foreground mb-6">{product.shortDescription}</p>

            {/* Cantidad y botones de acción */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Cantidad:
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Agregar al Carrito
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Agregar a Favoritos
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Características del producto */}
          <div>
            <h3 className="font-medium mb-2">Características principales</h3>
            <ul className="space-y-2">
              {product.features ? (
                product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">No hay características disponibles</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Tabs de información adicional */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="description">Descripción</TabsTrigger>
            <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
            <TabsTrigger value="reviews">Reseñas</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div dangerouslySetInnerHTML={{ __html: product.description || "No hay descripción disponible" }} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {product.specifications ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b pb-2">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No hay especificaciones disponibles</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{review.userName}</div>
                            <div className="flex">
                              {Array(5)
                                .fill()
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                  />
                                ))}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">{review.date}</div>
                        </div>
                        <p>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No hay reseñas disponibles</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Productos relacionados */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden">
                <div className="relative h-40 w-full">
                  <Image
                    src={relatedProduct.imageUrl || "/placeholder.svg?height=200&width=200"}
                    alt={relatedProduct.name || "Producto relacionado"}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2 mb-2">{relatedProduct.name}</h3>
                  <p className="font-bold">${relatedProduct.price.toLocaleString("es-AR")}</p>
                  <Button variant="outline" className="w-full mt-2 bg-transparent" asChild>
                    <Link href={`/productos/${relatedProduct.id}`}>Ver Detalles</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Componente de esqueleto para la carga de detalles de producto
 */
function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagen del producto */}
        <div>
          <Skeleton className="h-[400px] w-full mb-4 rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {Array(4)
              .fill()
              .map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded" />
              ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <div>
            <div className="flex gap-2 mb-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-10 w-16" />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-40" />
              </div>
            </div>
          </div>

          <Skeleton className="h-1 w-full" />

          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <div className="space-y-2">
              {Array(4)
                .fill()
                .map((_, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="h-5 w-5 mt-0.5" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Skeleton className="h-10 w-full mb-6" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )
}
