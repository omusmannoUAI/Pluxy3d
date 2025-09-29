// Lightweight logger wrapper — silences verbose logs in production and masks errors
const isProd = process.env.NODE_ENV === 'production'

export const logger = {
  debug: (...args: any[]) => {
    if (!isProd && typeof console !== 'undefined' && console.debug) console.debug(...args)
  },
  info: (...args: any[]) => {
    if (!isProd && typeof console !== 'undefined' && console.info) console.info(...args)
  },
  warn: (...args: any[]) => {
    if (!isProd && typeof console !== 'undefined' && console.warn) console.warn(...args)
  },
  // In production we print a generic message to avoid leaking details in browser console
  error: (...args: any[]) => {
    if (!isProd && typeof console !== 'undefined' && console.error) console.error(...args)
    else if (typeof console !== 'undefined' && console.error) console.error('An error occurred — check server logs for details')
  }
}

export default logger
