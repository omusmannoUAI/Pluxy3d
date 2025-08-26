import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), '.data')
const FILE = path.join(DATA_DIR, 'contacto.json')

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.access(FILE)
  } catch {
    await fs.writeFile(FILE, '[]', 'utf-8')
  }
}

export async function POST(req: Request) {
  try {
    await ensureFile()
    const body = await req.json()
    const { nombre, email, mensaje } = body || {}
    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: 'Campos requeridos' }, { status: 400 })
    }
    const raw = await fs.readFile(FILE, 'utf-8')
    const arr = JSON.parse(raw || '[]') as any[]
  const entry = { id: Date.now(), nombre, email, mensaje, createdAt: new Date().toISOString(), read: false }
    arr.push(entry)
    await fs.writeFile(FILE, JSON.stringify(arr, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    await ensureFile()
    const raw = await fs.readFile(FILE, 'utf-8')
    const arr = JSON.parse(raw || '[]')
    return NextResponse.json(arr)
  } catch (e: any) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function PATCH(req: Request) {
  try {
    await ensureFile()
    const body = await req.json().catch(() => ({} as any))
    const id = Number(body?.id)
    const read = body?.read
    if (!Number.isFinite(id) || typeof read !== 'boolean') {
      return NextResponse.json({ error: 'id y read requeridos' }, { status: 400 })
    }
    const raw = await fs.readFile(FILE, 'utf-8')
    const arr = JSON.parse(raw || '[]') as any[]
    const idx = arr.findIndex((x) => Number(x.id) === id)
    if (idx === -1) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    arr[idx] = { ...arr[idx], read, updatedAt: new Date().toISOString() }
    await fs.writeFile(FILE, JSON.stringify(arr, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureFile()
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get('id'))
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'id requerido' }, { status: 400 })
    }
    const raw = await fs.readFile(FILE, 'utf-8')
    const arr = JSON.parse(raw || '[]') as any[]
    const next = arr.filter((x) => Number(x.id) !== id)
    if (next.length === arr.length) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    await fs.writeFile(FILE, JSON.stringify(next, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error' }, { status: 500 })
  }
}
