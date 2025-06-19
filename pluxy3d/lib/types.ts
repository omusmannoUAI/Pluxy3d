export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  brand: string
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
