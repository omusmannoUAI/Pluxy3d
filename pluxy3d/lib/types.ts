export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  images?: string[]
  category: string
  brand: string
  rating?: number
  reviewsCount?: number
  stock?: 'in_stock' | 'out_of_stock'
  discount?: {
    percentage: number
    originalPrice: number
  }
}

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

export interface OrderSummaryItem {
  id: string
  name: string
  price: number
  quantity?: number
}

export interface User {
  id: number
  name: string
  email: string
}
