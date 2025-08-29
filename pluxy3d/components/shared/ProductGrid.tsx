"use client"

import React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/lib/types"
import { formatPriceSimple } from "@/lib/helpers"
import { Star, ShoppingCart } from "lucide-react"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onViewDetails?: (product: Product) => void
  className?: string
}

export function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
  className = ""
}: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart?.(product)
  }

  const handleViewDetails = () => {
    onViewDetails?.(product)
  }

  return (
    <Card
      className={`group cursor-pointer transition-all hover:shadow-lg ${className}`}
      onClick={handleViewDetails}
    >
      <CardContent className="p-4">
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.discount && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              -{product.discount.percentage}%
            </Badge>
          )}
          {product.stock === "out_of_stock" && (
            <Badge className="absolute top-2 right-2 bg-gray-500">
              Agotado
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{product.rating}</span>
              {product.reviewsCount && (
                <span className="text-sm text-muted-foreground">
                  ({product.reviewsCount})
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.discount ? (
                <>
                  <span className="font-bold text-lg">
                    {formatPriceSimple(product.price)}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPriceSimple(product.discount.originalPrice)}
                  </span>
                </>
              ) : (
                <span className="font-bold text-lg">
                  {formatPriceSimple(product.price)}
                </span>
              )}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock === "out_of_stock"}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock === "out_of_stock" ? "Agotado" : "Agregar al Carrito"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  onAddToCart?: (product: Product) => void
  onViewDetails?: (product: Product) => void
  className?: string
}

export function ProductGrid({
  products,
  loading = false,
  onAddToCart,
  onViewDetails,
  className = ""
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-muted-foreground">No se encontraron productos</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  )
}
