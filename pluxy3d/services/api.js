/**
 * Servicio para manejar las peticiones a la API de .NET
 */

// URL base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Función para obtener todos los productos
 * @param {Object} options - Opciones de filtrado
 * @param {string} [options.category] - Categoría de productos
 * @param {string} [options.brand] - Marca de productos
 * @param {number} [options.minPrice] - Precio mínimo
 * @param {number} [options.maxPrice] - Precio máximo
 * @param {string} [options.sort] - Ordenamiento
 * @param {number} [options.page] - Número de página
 * @param {number} [options.pageSize] - Tamaño de página
 * @returns {Promise<Array>} - Lista de productos
 */
export async function getProducts(options = {}) {
  try {
    // Construir parámetros de consulta para filtros
    const queryParams = new URLSearchParams()

    if (options.category) queryParams.append("category", options.category)
    if (options.search) queryParams.append("search", options.search)
    if (options.brand) {
      if (Array.isArray(options.brand)) {
        options.brand.forEach(b => queryParams.append("brand", b))
      } else {
        queryParams.append("brand", options.brand)
      }
    }
    if (options.minPrice) queryParams.append("minPrice", options.minPrice)
    if (options.maxPrice) queryParams.append("maxPrice", options.maxPrice)
    if (options.sort) queryParams.append("sort", options.sort)
    if (options.page) queryParams.append("page", options.page)
    if (options.pageSize) queryParams.append("pageSize", options.pageSize)

    const url = `${API_BASE_URL}/Products?${queryParams.toString()}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return data.map(mapProductFromApi)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    throw error
  }
}


/**
 * Función para obtener un producto por su ID
 * @param {number|string} id - ID del producto
 * @returns {Promise<Object>} - Datos del producto
 */
export async function getProductById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/Products/${id}`)

    if (!response.ok) {
      throw new Error(`Error al obtener el producto: ${response.status}`)
    }

    const data = await response.json()
    return mapProductFromApi(data)
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}:`, error)
    throw error
  }
}



/**
 * Función para obtener las categorías de productos
 * @returns {Promise<Array>} - Lista de categorías
 */
export async function getCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/Categorias`)

    if (!response.ok) {
      throw new Error(`Error al obtener categorías: ${response.status}`)
    }

    const data = await response.json()
    return data.map(cat => ({
      id: cat.id,
      name: cat.nombre,
      description: cat.descripcion
    }))
  } catch (error) {
    console.error("Error al obtener categorías:", error)
    throw error
  }
}

function getMockCategories() {
  return [
    { id: 1, name: "Impresoras" },
    { id: 2, name: "Componentes" },
    { id: 3, name: "Filamentos" },
    { id: 4, name: "Accesorios" },
  ]
}

/**
 * Función para obtener las marcas de productos
 * @returns {Promise<Array>} - Lista de marcas
 */
export async function getBrands() {
  try {
    const url = `${API_BASE_URL}/Brands`
    const response = await fetch(url)
    if (!response.ok) throw new Error("API not available")
    
    const data = await response.json()
    return data.map(brand => ({
      id: brand.id,
      name: brand.nombre,
      logo: brand.logo,
      active: brand.activo,
      totalProducts: brand.totalProductos
    }))
  } catch (error) {
    console.error("Error al obtener marcas:", error)
    return []
  }
}

/**
 * Función para obtener el inventario de productos
 * @param {Object} options - Opciones de filtrado
 * @returns {Promise<Array>} - Lista de productos con detalles de inventario
 */
export async function getInventory(options = {}) {
  try {
    const queryParams = new URLSearchParams()
    if (options.search) queryParams.append("search", options.search)
    if (options.status) queryParams.append("status", options.status)
    if (options.page) queryParams.append("page", options.page)
    if (options.pageSize) queryParams.append("pageSize", options.pageSize)

    const url = `${API_BASE_URL}/Inventory?${queryParams.toString()}`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error("API not available")
    return await response.json()
  } catch (error) {
    console.error("Error al obtener inventario:", error)
    return []
  }
}

/**
 * Función para obtener cupones
 * @param {Object} options
 * @returns {Promise<Array>}
 */
export async function getCoupons(options = {}) {
  try {
    const url = `${API_BASE_URL}/Coupons`
    const response = await fetch(url)
    if (!response.ok) throw new Error("API not available")
    return await response.json()
  } catch (error) {
    console.error("Error al obtener cupones:", error)
    return []
  }
}

/**
 * Función para obtener reseñas
 * @param {Object} options
 * @returns {Promise<Array>}
 */
export async function getReviews(options = {}) {
  try {
    const url = `${API_BASE_URL}/Reviews`
    const response = await fetch(url)
    if (!response.ok) throw new Error("API not available")
    return await response.json()
  } catch (error) {
    console.error("Error al obtener reseñas:", error)
    return []
  }
}

/**
 * Función para obtener tickets de soporte
 * @param {Object} options
 * @returns {Promise<Array>}
 */
export async function getSupportTickets(options = {}) {
  try {
    const url = `${API_BASE_URL}/Support/Tickets`
    const response = await fetch(url)
    if (!response.ok) throw new Error("API not available")
    return await response.json()
  } catch (error) {
    console.error("Error al obtener tickets:", error)
    return []
  }
}

/**
 * Función para obtener páginas de contenido
 * @returns {Promise<Array>}
 */
export async function getContentPages() {
  try {
    const url = `${API_BASE_URL}/Content/Pages`
    const response = await fetch(url)
    if (!response.ok) throw new Error("API not available")
    return await response.json()
  } catch (error) {
    console.error("Error al obtener contenido:", error)
    return []
  }
}

/**
 * Función para obtener usuarios
 * @returns {Promise<Array>}
 */
export async function getUsers() {
  try {
    const url = `${API_BASE_URL}/Users`
    const response = await fetch(url)
    if (!response.ok) throw new Error("API not available")
    return await response.json()
  } catch (e) {
    console.error("Error al obtener usuarios:", e)
    return []
  }
}

/**
 * Función para iniciar sesión
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      let errorData = {}
      try {
        // Intentar leer como texto primero para evitar errores de parsing si no es JSON
        const text = await response.text()
        try {
          errorData = JSON.parse(text)
        } catch {
          // Si no es JSON, usar el texto como mensaje
          errorData = { message: text || `Error ${response.status}` }
        }
      } catch (e) {
        console.error("Error reading error response:", e)
        errorData = { message: `Error ${response.status}` }
      }
      throw new Error(errorData.message || `Error ${response.status}: Credenciales inválidas`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error en login:", error)
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error("No se pudo conectar con el servidor. ")
    }
    throw error
  }
}

/**
 * Función para registrar usuario
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: userData.name,
        email: userData.email,
        password: userData.password,
        telefono: userData.phone || ""
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${response.status}: No se pudo registrar`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error en registro:", error)
    throw error
  }
}

/**
 * Función para crear un pedido
 * @param {Object} orderData - Datos del pedido
 * @returns {Promise<Object>} - Pedido creado
 */
export async function createOrder(orderData) {
  try {
    const url = `${API_BASE_URL}/Orders`
    const token = localStorage.getItem("token")
    
    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(orderData),
    })

    if (response.status === 401) {
      // Manejo de error 401 - Token expirado o inválido
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login?expired=true"
      throw new Error("Sesión expirada. Por favor inicia sesión nuevamente.")
    }

    if (!response.ok) {
      let errorMessage = `Error al crear el pedido: ${response.status}`
      try {
        const errorData = await response.text()
        try {
          const jsonError = JSON.parse(errorData)
          errorMessage = jsonError.message || jsonError.title || JSON.stringify(jsonError)
        } catch {
          errorMessage = errorData || errorMessage
        }
      } catch (e) {
        console.error("Error reading error response:", e)
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al crear el pedido:", error)
    throw error
  }
}

/**
 * Función para obtener los pedidos del usuario actual
 * @returns {Promise<Array>}
 */
export async function getMyOrders() {
  try {
    const url = `${API_BASE_URL}/Orders/mine`
    const token = localStorage.getItem("token")
    
    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      headers: headers
    })

    if (!response.ok) throw new Error("API not available")
    return await response.json()
  } catch (e) {
    console.error("Error al obtener pedidos:", e)
    return []
  }
}

/**
 * Función para obtener todos los pedidos (Admin)
 * @returns {Promise<Array>}
 */
export async function getAllOrders() {
  try {
    const url = `${API_BASE_URL}/Orders`
    const token = localStorage.getItem("token")
    
    const headers = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      headers: headers
    })

    if (!response.ok) throw new Error("API not available")
    return await response.json()
  } catch (e) {
    console.error("Error al obtener todos los pedidos:", e)
    return []
  }
}

/**
 * Función para obtener analíticas
 * @returns {Promise<Object>}
 */
export async function getAnalytics() {
  try {
    const url = `${API_BASE_URL}/Analytics`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`API not available: ${response.status}`)
    const data = await response.json()
    return mapAnalyticsFromApi(data)
  } catch (e) {
    console.warn("Advertencia: No se pudieron cargar las analíticas (usando datos por defecto).", e.message)
    return mapAnalyticsFromApi(null)
  }
}

function mapAnalyticsFromApi(data) {
  const analytics = data || {}

  const rawSalesProgress = analytics.salesProgress || analytics.SalesProgress || analytics.salesHistory || []
  const salesProgress = Array.isArray(rawSalesProgress)
    ? rawSalesProgress.map((item) => ({
        month: formatMonthLabel(item.month ?? item.Month),
        amount: Number(item.amount ?? item.Amount ?? item.total ?? 0),
        orders: Number(item.orders ?? item.Orders ?? 0),
      }))
    : []

  return {
    totalRevenue: Number(analytics.totalRevenue ?? analytics.TotalRevenue ?? 0),
    revenueGrowth: Number(analytics.revenueGrowth ?? analytics.RevenueGrowth ?? 0),
    totalOrders: Number(analytics.totalOrders ?? analytics.TotalOrders ?? analytics.totalSales ?? analytics.TotalSales ?? 0),
    ordersGrowth: Number(analytics.ordersGrowth ?? analytics.OrdersGrowth ?? 0),
    totalCustomers: Number(analytics.totalCustomers ?? analytics.TotalCustomers ?? analytics.activeUsers ?? analytics.ActiveUsers ?? 0),
    customersGrowth: Number(analytics.customersGrowth ?? analytics.CustomersGrowth ?? 0),
    conversionRate: Number(analytics.conversionRate ?? analytics.ConversionRate ?? 0),
    salesProgress,
    topProducts: Array.isArray(analytics.topProducts) ? analytics.topProducts : Array.isArray(analytics.TopProducts) ? analytics.TopProducts : [],
    ordersByStatus: analytics.ordersByStatus || analytics.OrdersByStatus || {},
  }
}

function formatMonthLabel(value) {
  if (!value) return ""
  const date = new Date(`${value}-01`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
}

/**
 * Función para obtener configuración
 * @returns {Promise<Object>}
 */
export async function getSettings() {
  try {
    const url = `${API_BASE_URL}/Settings`
    const response = await fetch(url)
    if (!response.ok) throw new Error("API not available")
    return await response.json()
  } catch (e) {
    console.error("Error al obtener configuración:", e)
    return {
      storeName: "Pluxy 3D",
      storeEmail: "contacto@pluxy3d.com",
      storeDescription: "Tienda especializada en impresión 3D",
      currency: "ARS",
      timezone: "America/Argentina/Buenos_Aires",
      paymentMethods: {
        stripe: false,
        paypal: false
      },
      shipping: {
        freeShippingEnabled: false,
        freeShippingThreshold: 0
      },
      notifications: {
        newOrder: false,
        lowStock: false
      }
    }
  }
}

/**
 * Mapea un producto de la API al formato del frontend
 */
function mapProductFromApi(product) {
  return {
    id: product.id,
    name: product.nombre,
    description: product.descripcion,
    shortDescription: product.descripcion ? product.descripcion.substring(0, 100) + '...' : '',
    price: product.precioBase,
    originalPrice: product.precioBase * 1.2, // Simulado
    imageUrl: product.image || '/images/products/placeholder.jpg',
    categoryName: product.categoriaNombre || 'General',
    categoryId: product.categoriaId,
    brandName: 'Generico', // La API no devuelve marca
    brandId: 0,
    inStock: (product.stock || 0) > 0,
    stock: product.stock,
    freeShipping: product.precioBase > 100000,
    rating: 5, // Simulado
    reviewCount: 0, // Simulado
    features: [], // La API no devuelve features
    specifications: {} // La API no devuelve specs
  }
}

