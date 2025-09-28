"use client"

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { apiFetch } from '@/lib/api'
import { Product } from '@/lib/types'

export interface CartItem {
  id: number
  productId: number
  name: string
  description?: string
  price: number
  image?: string
  quantity: number
  discount?: {
    percentage: number
    originalPrice: number
  }
}

interface CartState {
  items: CartItem[]
  loading: boolean
  error: string | null
}

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => Promise<void>
  addCustomItem: (args: { name: string; price: number; description?: string; quantity?: number; image?: string }) => void
  removeFromCart: (itemId: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'SET_STATE'; payload: Partial<CartState> }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: number; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'CLEAR_ITEMS' }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'SET_ITEMS':
      // Evitar actualizaciones innecesarias si los items son iguales
      const itemsEqual = JSON.stringify(state.items) === JSON.stringify(action.payload)
      if (itemsEqual && !state.loading) {
        return state // No cambiar nada si son iguales y no está cargando
      }
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null
      }
    case 'SET_STATE':
      return { ...state, ...action.payload }
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.productId === action.payload.productId)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.productId === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          loading: false,
          error: null
        }
      } else {
        return {
          ...state,
          items: [...state.items, action.payload],
          loading: false,
          error: null
        }
      }
    }
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        loading: false,
        error: null
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        loading: false,
        error: null
      }
    case 'CLEAR_ITEMS':
      return {
        ...state,
        items: [],
        loading: false,
        error: null
      }
    default:
      return state
  }
}

const CartContext = createContext<CartContextType | null>(null)

const initialState: CartState = {
  items: [],
  loading: false,
  error: null
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const itemsRef = React.useRef<CartItem[]>([]) // Para evitar bucles infinitos en localStorage
  const currentItemsRef = React.useRef<CartItem[]>([]) // Para acceder a items actuales en callbacks

  // Mantener refs sincronizados con el estado
  useEffect(() => {
    itemsRef.current = [...state.items]
    currentItemsRef.current = [...state.items]
  }, [state.items])

  // Load cart on mount - only once with cleanup and timeout
  useEffect(() => {
    if (typeof window === 'undefined') return
    let isMounted = true
    const loadCart = async () => {
      try {
        // Primero intentar cargar desde localStorage inmediatamente
        const raw = window.localStorage.getItem('pluxy_cart')
        const items = raw ? (JSON.parse(raw) as CartItem[]) : []
        if (isMounted && items.length > 0) {
          dispatch({ type: 'SET_ITEMS', payload: items })
        }

        // Luego intentar sincronizar con el backend en background (no bloqueante)
        const timeoutId = setTimeout(async () => {
          if (!isMounted) return
          try {
            const data = await apiFetch('/carrito')
            if (Array.isArray(data) && data.length > 0 && isMounted) {
              const mapped = data.map((d: any) => ({
                id: d.id,
                productId: d.impresoraId || d.ImpresoraId,
                name: d.productoNombre || d.ProductoNombre,
                description: d.descripcion || d.Descripcion,
                price: Number(d.precioUnitario || d.PrecioUnitario || 0),
                image: d.productoImage || d.ProductoImage,
                quantity: Number(d.cantidad || d.Cantidad || 1),
              })) as CartItem[]
              dispatch({ type: 'SET_ITEMS', payload: mapped })
            }
          } catch (error) {
            // Silenciar errores del backend para no afectar UX
            console.warn('Backend not available, using local cart')
          }
        }, 100) // Pequeño delay para no bloquear el renderizado inicial

        return () => clearTimeout(timeoutId)
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }

    const cleanup = loadCart()
    return () => {
      isMounted = false
      cleanup?.then?.(fn => fn?.())
    }
  }, []) // Sin dependencias para que solo se ejecute una vez

  // Persistencia local optimizada - evitar bucles infinitos
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Solo guardar si los items realmente cambiaron y no están vacíos
    const currentItems = currentItemsRef.current
    const itemsChanged = JSON.stringify(state.items) !== JSON.stringify(currentItems)

    if (!itemsChanged || state.items.length === 0) return

    try {
      window.localStorage.setItem('pluxy_cart', JSON.stringify(state.items))
      itemsRef.current = [...state.items] // Actualizar ref con copia
    } catch (error) {
      console.warn('Error saving cart to localStorage:', error)
    }
  }, [state.items])

  const refreshCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const data = await apiFetch('/carrito')
      const mapped = Array.isArray(data) ? data.map((d: any) => ({
        id: d.id,
        productId: d.impresoraId || d.ImpresoraId,
        name: d.productoNombre || d.ProductoNombre,
        description: d.descripcion || d.Descripcion,
        price: Number(d.precioUnitario || d.PrecioUnitario || 0),
        image: d.productoImage || d.ProductoImage,
        quantity: Number(d.cantidad || d.Cantidad || 1),
      })) as CartItem[] : []

      // Solo actualizar si los datos realmente cambiaron
      const dataChanged = JSON.stringify(mapped) !== JSON.stringify(currentItemsRef.current)
      if (dataChanged) {
        dispatch({ type: 'SET_ITEMS', payload: mapped })
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } catch (error) {
      console.error('Error loading cart:', error)
      dispatch({ type: 'SET_STATE', payload: { error: 'Error al cargar el carrito', loading: false } })
    }
  }, []) // Remover dependencias para evitar recreación constante

  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const cartItemDto = { ImpresoraId: product.id, Cantidad: quantity }
      await apiFetch('/carrito', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItemDto)
      })

      // Después de agregar, refrescar el carrito
      await refreshCart()
    } catch (error) {
      console.error('Error adding to cart:', error)
      dispatch({ type: 'SET_STATE', payload: { error: 'Error al agregar al carrito', loading: false } })
    }
  }, [refreshCart])

  const removeFromCart = useCallback(async (itemId: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      await apiFetch(`/carrito/${itemId}`, { method: 'DELETE' })
      dispatch({ type: 'REMOVE_ITEM', payload: itemId })
    } catch (error) {
      console.error('Error removing from cart:', error)
      dispatch({ type: 'SET_STATE', payload: { error: 'Error al eliminar del carrito', loading: false } })
    }
  }, [])

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    if (quantity < 1) return
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      await apiFetch(`/carrito/${itemId}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ NuevaCantidad: quantity }) 
      }) 
      dispatch({ type: 'UPDATE_ITEM', payload: { id: itemId, quantity } })
    } catch (error) {
      console.error('Error updating quantity:', error)
      dispatch({ type: 'SET_STATE', payload: { error: 'Error al actualizar cantidad', loading: false } })
    }
  }, [])

  const clearCart = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      await apiFetch('/carrito/clear', { method: 'DELETE' })
      dispatch({ type: 'CLEAR_ITEMS' })
    } catch (error) {
      console.error('Error clearing cart:', error)
      dispatch({ type: 'SET_STATE', payload: { error: 'Error al vaciar el carrito', loading: false } })
    }
  }, [])

  const getTotalItems = useCallback(() => {
    return currentItemsRef.current.reduce((total, item) => total + item.quantity, 0)
  }, [])

  const getTotalPrice = useCallback(() => {
    return currentItemsRef.current.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [])

  const value: CartContextType = {
    ...state,
    addToCart,
    addCustomItem: ({ name, price, description, quantity = 1, image }) => {
      // Verificar si ya existe un item con el mismo nombre y precio
      const existingItem = currentItemsRef.current.find(item =>
        item.name === name && item.price === price && item.productId < 0
      )

      if (existingItem) {
        // Si existe, actualizar cantidad en lugar de crear nuevo
        dispatch({
          type: 'UPDATE_ITEM',
          payload: { id: existingItem.id, quantity: existingItem.quantity + quantity }
        })
      } else {
        // Genera IDs únicos locales (negativos para evitar colisiones con backend)
        const timestamp = Date.now()
        const random = Math.floor(Math.random() * 1000)
        const id = timestamp + random
        const productId = -id

        const newItem: CartItem = {
          id,
          productId,
          name,
          description,
          price,
          image,
          quantity,
        }
        dispatch({ type: 'ADD_ITEM', payload: newItem })
      }
    },
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    getTotalItems,
    getTotalPrice
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
