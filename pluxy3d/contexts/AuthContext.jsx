"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { loginUser, registerUser } from "@/services/api"
import { useRouter, usePathname } from "next/navigation"

/**
 * @typedef {Object} User
 * @property {string} id - ID del usuario
 * @property {string} nombre - Nombre del usuario
 * @property {string} email - Email del usuario
 * @property {string} telefono - Teléfono del usuario
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user - Usuario actual
 * @property {boolean} loading - Estado de carga
 * @property {Function} login - Función para iniciar sesión
 * @property {Function} register - Función para registrarse
 * @property {Function} logout - Función para cerrar sesión
 * @property {boolean} isAuthenticated - Si el usuario está autenticado
 */

const AuthContext = createContext(null)

/**
 * Hook para usar el contexto de autenticación
 * @returns {AuthContextType} Contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

/**
 * Proveedor del contexto de autenticación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos
 */
export function AuthProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  
  /**
   * @type {[User|null, Function]} Usuario actual
   */
  const [user, setUser] = useState(null)

  /**
   * @type {[boolean, Function]} Estado de carga
   */
  const [loading, setLoading] = useState(true)

  // Rutas protegidas
  const protectedRoutes = ["/carrito", "/checkout", "/perfil", "/mis-pedidos", "/cuenta"]

  // Verificar si hay un usuario guardado al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (savedUser && token) {
          // Aquí podrías decodificar el token para verificar expiración si no tienes un endpoint de "me"
          // Por simplicidad, asumimos que si está en storage es válido hasta que falle una petición
          setUser(JSON.parse(savedUser))
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Protección de rutas
  useEffect(() => {
    if (!loading) {
      const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
      if (isProtectedRoute && !user) {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      }
    }
  }, [pathname, user, loading, router])

  /**
   * Función para iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<{success: boolean, message?: string, user?: User}>}
   */
  const login = async (email, password) => {
    try {
      setLoading(true)
      const data = await loginUser(email, password)
      
      if (data.token && data.user) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)
        return { success: true, user: data.user }
      } else {
        return { success: false, message: "Respuesta inválida del servidor" }
      }
    } catch (error) {
      console.error("Error en login:", error)
      return {
        success: false,
        message: error.message || "Error al iniciar sesión",
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Función para registrarse
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<{success: boolean, message?: string, user?: User}>}
   */
  const register = async (userData) => {
    try {
      setLoading(true)
      const data = await registerUser(userData)

      if (data.token && data.user) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setUser(data.user)
        return { success: true, user: data.user }
      } else {
        return { success: false, message: "Respuesta inválida del servidor" }
      }
    } catch (error) {
      console.error("Error en registro:", error)
      return {
        success: false,
        message: error.message || "Error al registrarse",
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Función para cerrar sesión
   */
  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
