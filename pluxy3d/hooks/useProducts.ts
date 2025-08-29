"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Product } from "@/lib/types"

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: 'name' | 'price' | 'rating'
  sortOrder?: 'asc' | 'desc'
}

export function useProducts(initialFilters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {})

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // In a real app, this would be an API call
        // For now, we'll simulate loading
        const mockProducts: Product[] = [
          {
            id: 1,
            name: "Creality Ender 3 V2",
            description: "Impresora 3D de alta calidad",
            price: 320000,
            image: "/placeholder.svg",
            category: "impresoras",
            brand: "Creality",
            rating: 4.5,
            stock: "in_stock" as const
          },
          {
            id: 2,
            name: "Kit Mejora Ender-3",
            description: "Kit completo para mejorar tu impresora",
            price: 22750,
            image: "/placeholder.svg",
            category: "accesorios",
            brand: "Creality",
            rating: 4.2,
            stock: "in_stock" as const
          }
        ]

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        setProducts(mockProducts)
      } catch (err) {
        setError('Error al cargar productos')
        console.error('Error loading products:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Apply filters
    if (filters.category) {
      result = result.filter(p => p.category === filters.category)
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= filters.minPrice!)
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(p => p.price <= filters.maxPrice!)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      )
    }

    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        let aValue: any, bValue: any

        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase()
            bValue = b.name.toLowerCase()
            break
          case 'price':
            aValue = a.price
            bValue = b.price
            break
          case 'rating':
            aValue = a.rating || 0
            bValue = b.rating || 0
            break
          default:
            return 0
        }

        if (aValue < bValue) return filters.sortOrder === 'desc' ? 1 : -1
        if (aValue > bValue) return filters.sortOrder === 'desc' ? -1 : 1
        return 0
      })
    }

    return result
  }, [products, filters])

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category))
    return Array.from(cats).filter(Boolean)
  }, [products])

  // Price range
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0 }

    const prices = products.map(p => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }, [products])

  return {
    products: filteredProducts,
    allProducts: products,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    categories,
    priceRange,
    totalCount: products.length,
    filteredCount: filteredProducts.length
  }
}
