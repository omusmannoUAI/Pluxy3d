import { NextRequest } from "next/server"
import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), ".data")
const dataFile = path.join(dataDir, "newsletter.json")

type Subscriber = {
  email: string
  status: "subscribed" | "unsubscribed"
  subscribedAt: string
  unsubscribedAt?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    const buf = await fs.promises.readFile(dataFile, "utf8")
    return JSON.parse(buf)
  } catch {
    return []
  }
}

async function writeSubscribers(data: Subscriber[]) {
  await fs.promises.mkdir(dataDir, { recursive: true })
  await fs.promises.writeFile(dataFile, JSON.stringify(data, null, 2), "utf8")
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = String(body.email || "").trim().toLowerCase()
    if (!email || !isValidEmail(email)) {
      return Response.json({ ok: false, message: "Email inválido" }, { status: 400 })
    }

    const subs = await readSubscribers()
    const now = new Date().toISOString()
    const idx = subs.findIndex((s) => s.email === email)
    if (idx >= 0) {
      // If already subscribed, return 200 idempotently
      if (subs[idx].status === "subscribed") {
        return Response.json({ ok: true, message: "Ya estás suscripto" })
      }
      subs[idx] = { ...subs[idx], status: "subscribed", subscribedAt: now, unsubscribedAt: undefined }
      await writeSubscribers(subs)
      return Response.json({ ok: true, message: "Suscripción reactivada" })
    }

    subs.unshift({ email, status: "subscribed", subscribedAt: now })
    await writeSubscribers(subs)
    return Response.json({ ok: true, message: "Te suscribiste al newsletter" })
  } catch (e) {
    return Response.json({ ok: false, message: "Error del servidor" }, { status: 500 })
  }
}

export async function GET() {
  // Return a minimal summary (count only) to avoid exposing emails
  try {
    const subs = await readSubscribers()
    const count = subs.filter((s) => s.status === "subscribed").length
    return Response.json({ ok: true, count })
  } catch {
    return Response.json({ ok: true, count: 0 })
  }
}
