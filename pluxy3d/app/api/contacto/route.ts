import { NextRequest } from "next/server"
import fs from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), ".data")
const dataFile = path.join(dataDir, "contacto.json")

type Mensaje = {
  id: number
  nombre: string
  email: string
  mensaje: string
  read?: boolean
  createdAt: string
}

async function readMensajes(): Promise<Mensaje[]> {
  try {
    const buf = await fs.promises.readFile(dataFile, "utf8")
    return JSON.parse(buf)
  } catch {
    return []
  }
}

async function writeMensajes(data: Mensaje[]) {
  await fs.promises.mkdir(dataDir, { recursive: true })
  await fs.promises.writeFile(dataFile, JSON.stringify(data, null, 2), "utf8")
}

export async function GET() {
  try {
    const msgs = await readMensajes()
    return Response.json(msgs)
  } catch (e) {
    return Response.json([], { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const nombre = String(body.nombre || body.name || "").trim()
    const email = String(body.email || "").trim()
    const mensaje = String(body.mensaje || body.message || "").trim()
    if (!nombre || !email || !mensaje) {
      return Response.json({ error: "Campos requeridos" }, { status: 400 })
    }

    const msgs = await readMensajes()
    const id = msgs.length > 0 ? Math.max(...msgs.map((m) => m.id)) + 1 : 1
    const now = new Date().toISOString()
    const nuevo: Mensaje = { id, nombre, email, mensaje, read: false, createdAt: now }
    msgs.unshift(nuevo)
    await writeMensajes(msgs)
    return Response.json({ ok: true, mensaje: nuevo })
  } catch (e: any) {
    return Response.json({ error: e?.message || "Error del servidor" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const id = Number(body.id || 0)
    if (!id) return Response.json({ error: "id requerido" }, { status: 400 })

    const msgs = await readMensajes()
    const idx = msgs.findIndex((m) => m.id === id)
    if (idx === -1) return Response.json({ error: "No encontrado" }, { status: 404 })

    msgs[idx] = { ...msgs[idx], read: Boolean(body.read) }
    await writeMensajes(msgs)
    return Response.json({ ok: true })
  } catch (e: any) {
    return Response.json({ error: e?.message || "Error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const id = Number(url.searchParams.get("id") || 0)
    if (!id) return Response.json({ error: "id requerido" }, { status: 400 })

    const msgs = await readMensajes()
    const remaining = msgs.filter((m) => m.id !== id)
    if (remaining.length === msgs.length) return Response.json({ error: "No encontrado" }, { status: 404 })

    await writeMensajes(remaining)
    return Response.json({ ok: true })
  } catch (e: any) {
    return Response.json({ error: e?.message || "Error" }, { status: 500 })
  }
}
