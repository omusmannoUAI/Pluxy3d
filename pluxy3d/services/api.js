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
    return await response.json()
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

    if (!response.ok) {
      throw new Error(`Error al crear el pedido: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error al crear el pedido:", error)
    throw error
  }
}

/**
 * Función para obtener pedidos
 * @returns {Promise<Array>}
 */
export async function getOrders() {
  try {
    const url = `${API_BASE_URL}/Orders`
    const response = await fetch(url)
    if (!response.ok) throw new Error("API not available")
    return await response.json()
  } catch (e) {
    console.error("Error al obtener pedidos:", e)
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
    return await response.json()
  } catch (e) {
    console.warn("Advertencia: No se pudieron cargar las analíticas (usando datos por defecto).", e.message)
    return {
      totalRevenue: 0,
      totalSales: 0,
      activeUsers: 0,
      conversionRate: 0,
      salesHistory: [],
      categoryDistribution: []
    }
  }
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

