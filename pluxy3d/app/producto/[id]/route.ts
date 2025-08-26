import { NextResponse } from 'next/server'

export function GET(req: Request, { params }: { params: { id: string } }) {
  const url = new URL(req.url)
  url.pathname = `/productos/id/${params.id}`
  return NextResponse.redirect(url)
}
