import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Do not redirect /productos/id/:id; it is a stable detail route
  // Redirect /producto/:id -> /productos/id/:id (support old links)
  const productoDirect = pathname.match(/^\/producto\/(\d+)(?:\/?|$)/)
  if (productoDirect) {
    const id = productoDirect[1]
    const url = req.nextUrl.clone()
    url.pathname = `/productos/id/${id}`
    return NextResponse.redirect(url)
  }

  // Redirect /productos/:id (numeric) -> /productos/id/:id (stable)
  const numericAsCategory = pathname.match(/^\/productos\/(\d+)(?:\/?|$)/)
  if (numericAsCategory) {
    const id = numericAsCategory[1]
    const url = req.nextUrl.clone()
    url.pathname = `/productos/id/${id}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/productos/:path*', '/producto/:path*']
}
