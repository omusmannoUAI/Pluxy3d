"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/CartContext"
import { useState } from "react"
import { Product } from "@/lib/types"
import { formatPriceSimple } from "@/lib/helpers"

interface ProductCardProps {
  product: Product
  showBrand?: boolean
  showFavoriteButton?: boolean
  onAddToCart?: (product: Product) => void
  className?: string
}

export function ProductCard({ 
  product, 
  showBrand = true, 
  showFavoriteButton = true,
  onAddToCart,
  className = ""
}: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (onAddToCart) {
      onAddToCart(product)
    } else {
      try {
        setIsAdding(true)
        await addToCart(product)
      } catch (error) {
        console.error('Error adding to cart:', error)
      } finally {
        setIsAdding(false)
      }
    }
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative">
        <div className="relative h-48 w-full">
          <Image 
            src={product.image || "/placeholder.svg"} 
            alt={product.name} 
            fill 
            className="object-cover" 
          />
        </div>
        {showFavoriteButton && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
            aria-label="Agregar a favoritos"
          >
            <Heart className="h-5 w-5" />
          </Button>
        )}
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            -{product.discount.percentage}%
          </div>
        )}
      </div>
      
      <CardHeader>
        {showBrand && product.brand && (
          <div className="text-sm text-muted-foreground">{product.brand}</div>
        )}
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">
          {product.description}
        </p>
        <div className="flex items-center gap-2">
          {product.discount && (
            <span className="text-sm line-through text-muted-foreground">
              {formatPriceSimple(product.discount.originalPrice)}
            </span>
          )}
          <span className="text-xl font-bold">
            {formatPriceSimple(product.price)}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href={`/productos/id/${product.id}`}>Ver Detalles</Link>
        </Button>
        <Button 
          variant="purple"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAdding ? "Agregando..." : "Agregar"}
        </Button>
      </CardFooter>
    </Card>
  )
}
