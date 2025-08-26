/**
 * Utility functions for common operations throughout the application
 */

/**
 * Formats a price number to a localized currency string
 * @param price - The price to format
 * @param currency - The currency code (default: 'CLP')
 * @param locale - The locale for formatting (default: 'es-CL')
 */
export function formatPrice(price: number, currency: string = 'CLP', locale: string = 'es-CL'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price).replace('CLP', '$')
}

/**
 * Formats a price number to a simple string with thousands separator
 * @param price - The price to format
 */
export function formatPriceSimple(price: number, locale: string = 'es-CL'): string {
  // Deterministic thousands separator to avoid SSR/CSR mismatches
  return `$${price.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

/**
 * Calculates discount percentage between two prices
 * @param originalPrice - The original price
 * @param discountedPrice - The discounted price
 */
export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
}

/**
 * Validates email format
 * @param email - The email to validate
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates phone number format (Chilean format)
 * @param phone - The phone number to validate
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+56|56)?[2-9]\d{8}$/
  return phoneRegex.test(phone.replace(/\s|-/g, ''))
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Debounce function to limit the rate of function calls
 * @param func - The function to debounce
 * @param wait - The number of milliseconds to delay
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Truncates text to a specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - The maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to convert
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
