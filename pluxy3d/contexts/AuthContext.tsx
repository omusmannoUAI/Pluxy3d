"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

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

  const login = async (email: string, _password: string) => {
    // Mock login: in real world call backend and validate
    const isAdmin = /^(admin|administrator)@/i.test(email) || /@pluxy3d\.com$/i.test(email)
    const mock: AuthUser = { id: 1, name: email.split('@')[0] || 'Usuario', email, role: isAdmin ? 'admin' : 'customer' }
    setUser(mock)
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
