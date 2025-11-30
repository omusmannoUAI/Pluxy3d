"use client"

import { createContext, useContext, useState, useEffect } from "react"

/**
 * @typedef {Object} User
 * @property {number} id - ID del usuario
 * @property {string} name - Nombre del usuario
 * @property {string} email - Email del usuario
 * @property {string} phone - Teléfono del usuario
 * @property {string} avatar - URL del avatar del usuario
 * @property {Array} addresses - Direcciones guardadas del usuario
 * @property {Array} paymentMethods - Métodos de pago guardados
 * @property {string} role - Rol del usuario (customer, admin)
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user - Usuario actual
 * @property {boolean} loading - Estado de carga
 * @property {Function} login - Función para iniciar sesión
 * @property {Function} register - Función para registrarse
 * @property {Function} logout - Función para cerrar sesión
 * @property {Function} updateUser - Función para actualizar datos del usuario
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
  /**
   * @type {[User|null, Function]} Usuario actual
   */
  const [user, setUser] = useState(null)

  /**
   * @type {[boolean, Function]} Estado de carga
   */
  const [loading, setLoading] = useState(true)

  // Verificar si hay un usuario guardado al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (savedUser && token) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  /**
   * Función para iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<{success: boolean, message?: string, user?: User}>}
   */
  const login = async (email, password) => {
    try {
      setLoading(true)

      // Simulamos una petición a la API
      // En un caso real, harías una petición a tu API .NET
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulamos usuarios de prueba
      const testUsers = [
        {
          id: 1,
          name: "Juan Pérez",
          email: "juan@example.com",
          password: "123456",
          phone: "+54 11 1234-5678",
          avatar: "/placeholder.svg?height=100&width=100",
          role: "customer",
          addresses: [
            {
              id: 1,
              name: "Casa",
              address: "Av. Corrientes 1234",
              city: "Buenos Aires",
              state: "CABA",
              zipCode: "1043",
              isDefault: true,
            },
          ],
          paymentMethods: [
            {
              id: 1,
              type: "credit_card",
              last4: "4242",
              brand: "Visa",
              expiryMonth: 12,
              expiryYear: 2025,
              isDefault: true,
            },
          ],
        },
        {
          id: 2,
          name: "María García",
          email: "maria@example.com",
          password: "123456",
          phone: "+54 11 9876-5432",
          avatar: "/placeholder.svg?height=100&width=100",
          role: "customer",
          addresses: [],
          paymentMethods: [],
        },
        {
          id: 3,
          name: "Admin User",
          email: "admin@pluxy3d.com",
          password: "admin123",
          phone: "+54 11 0000-0000",
          avatar: "/placeholder.svg?height=100&width=100",
          role: "admin",
          addresses: [],
          paymentMethods: [],
        },
      ]

      const foundUser = testUsers.find((u) => u.email === email && u.password === password)

      if (!foundUser) {
        return {
          success: false,
          message: "Email o contraseña incorrectos",
        }
      }

      // Remover la contraseña del objeto usuario
      const { password: _, ...userWithoutPassword } = foundUser

      // Simular token JWT
      const token = `fake-jwt-token-${foundUser.id}-${Date.now()}`

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      localStorage.setItem("token", token)

      setUser(userWithoutPassword)

      return {
        success: true,
        user: userWithoutPassword,
      }
    } catch (error) {
      console.error("Error en login:", error)
      return {
        success: false,
        message: "Error interno del servidor",
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Función para registrarse
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.name - Nombre del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña del usuario
   * @returns {Promise<{success: boolean, message?: string, user?: User}>}
   */
  const register = async (userData) => {
    try {
      setLoading(true)

      // Simulamos una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar si el email ya existe (simulado)
      const existingEmails = ["juan@example.com", "maria@example.com", "admin@pluxy3d.com"]

      if (existingEmails.includes(userData.email)) {
        return {
          success: false,
          message: "Este email ya está registrado",
        }
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now(), // ID temporal para demo
        name: userData.name,
        email: userData.email,
        phone: "",
        avatar: "/placeholder.svg?height=100&width=100",
        role: "customer",
        addresses: [],
        paymentMethods: [],
      }

      // Simular token JWT
      const token = `fake-jwt-token-${newUser.id}-${Date.now()}`

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(newUser))
      localStorage.setItem("token", token)

      setUser(newUser)

      return {
        success: true,
        user: newUser,
      }
    } catch (error) {
      console.error("Error en registro:", error)
      return {
        success: false,
        message: "Error interno del servidor",
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
  }

  /**
   * Función para actualizar datos del usuario
   * @param {Partial<User>} updates - Datos a actualizar
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  const updateUser = async (updates) => {
    try {
      setLoading(true)

      // Simulamos una petición a la API
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedUser = { ...user, ...updates }

      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)

      return {
        success: true,
      }
    } catch (error) {
      console.error("Error al actualizar usuario:", error)
      return {
        success: false,
        message: "Error al actualizar los datos",
      }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
