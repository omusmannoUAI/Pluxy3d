import { NextRequest, NextResponse } from "next/server"
import { gen } from "./gen"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const range = searchParams.get("range") || "30d"
  const allowed = new Set(["7d", "30d", "this-month", "last-month"]) 
  const safeRange = allowed.has(range) ? range : "30d"
  const data = gen(safeRange)
  return NextResponse.json(data, { status: 200 })
}
