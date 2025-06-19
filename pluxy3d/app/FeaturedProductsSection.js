"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProductCard } from "@/components/shared/ProductCard"
import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api"

export default function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await apiFetch('/productos')
        // Show first 3 products as featured
        setFeaturedProducts(products.slice(0, 3))
      } catch (error) {
        console.error('Error loading products:', error)
        // Fallback to empty array if API fails
        setFeaturedProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">Productos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-64"></div>
            </div>
          ))}
        </div>
      </section>
    )
  }  return (
    <section className="container mx-auto w-full">
      <h2 className="text-3xl font-bold text-center mb-12">Productos Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard 
            key={product.id} 
            product={{
              id: product.id,
              name: product.nombre,
              description: product.descripcion,
              price: product.precio,
              image: product.image,
              category: product.categoria,
              brand: product.marca
            }} 
            showBrand={false}
          />
        ))}
      </div>
      <div className="text-center mt-10">
        <Button asChild size="lg">
          <Link href="/productos">Ver Todos los Productos</Link>
        </Button>
      </div>
    </section>
  )
}
