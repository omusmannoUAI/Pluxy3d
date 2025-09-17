"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Product } from "@/lib/types"
import { apiFetch } from "@/lib/api"

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

        // Build query parameters for API call
        const queryParams = new URLSearchParams()
        
        if (filters.category) {
          queryParams.append('category', filters.category)
        }
        
        if (filters.sortBy) {
          let apiSortBy: string = filters.sortBy
          if (filters.sortBy === 'name') apiSortBy = 'nombre'
          if (filters.sortBy === 'price') apiSortBy = 'precio'
          queryParams.append('sortBy', apiSortBy)
          queryParams.append('desc', filters.sortOrder === 'desc' ? 'true' : 'false')
        }

        // Large page size to get all products for client-side filtering
        queryParams.append('page', '1')
        queryParams.append('pageSize', '1000')

        const queryString = queryParams.toString()
        const endpoint = `/productos${queryString ? `?${queryString}` : ''}`
        
        const response = await apiFetch(endpoint)
        
        // Handle paginated response from API
        let productItems = []
        if (response && response.items && Array.isArray(response.items)) {
          productItems = response.items
        } else if (Array.isArray(response)) {
          productItems = response
        }
        
        // Map API response to frontend Product interface
        const products: Product[] = productItems.map((item: any) => ({
          id: item.id,
          name: item.nombre || item.name,
          description: item.descripcion || item.description,
          price: Number((item.precio || item.price) ?? 0),
          image: item.imagen || item.image || "/placeholder.svg",
          category: item.categoria || item.category,
          brand: item.marca || item.brand,
          rating: Number(item.rating || item.calificacion || 0),
          stock: item.stock || (item.cantidad > 0 ? "in_stock" : "out_of_stock")
        }))

        console.log('useProducts loaded:', products.length, products)
        setProducts(products)
      } catch (err) {
        setError('Error al cargar productos')
        console.error('Error loading products:', err)
        // Fallback to empty array on error
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, []) // Remove filters dependency to load all products once

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
