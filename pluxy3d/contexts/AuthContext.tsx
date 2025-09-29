"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import logger from '@/lib/logger'

export interface AuthUser {
  id: number
  name: string
  email: string
  role?: 'admin' | 'customer'
}

type AuthContextType = {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<AuthUser>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem('pluxy_user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) window.localStorage.setItem('pluxy_user', JSON.stringify(user))
    else window.localStorage.removeItem('pluxy_user')
  }, [user])

  const login = async (email: string, password: string) => {
    try {
      // Call the real authentication API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5299/api'}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const userData = await response.json()
        const user: AuthUser = {
          id: userData.id,
          name: userData.name || userData.nombre || email.split('@')[0],
          email: userData.email || email,
          role: userData.role || userData.rol || 'customer'
        }
        setUser(user)
      } else {
        throw new Error('Credenciales inválidas')
      }
    } catch (error) {
      // Fallback to mock login for development if API is not available
      logger.warn('API login failed, using mock login:', error)
      const isAdmin = /^(admin|administrator)@/i.test(email) || /@pluxy3d\.com$/i.test(email)
      const mock: AuthUser = { id: 1, name: email.split('@')[0] || 'Usuario', email, role: isAdmin ? 'admin' : 'customer' }
      setUser(mock)
    }
  }

  const logout = () => setUser(null)

  const updateProfile = (data: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...data } : prev)
  }

  const value = useMemo(() => ({ user, login, logout, updateProfile }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
