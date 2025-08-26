import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const dataDir = path.join(process.cwd(), "pluxy3d", ".data")
const dataFile = path.join(dataDir, "settings.json")

function defaults() {
  return {
    general: {
      siteName: "Pluxy 3D",
      currency: "ARS",
      siteUrl: "https://pluxy3d.com",
      taxRate: 21,
      contactEmail: "info@pluxy3d.com",
      address: "Av. Corrientes 1234, CABA, Argentina",
      phone: "+54 11 1234-5678",
      features: { allowRegister: true, enableReviews: true, enableCoupons: true },
      security: { emailVerification: true, wishlist: true, maintenanceMode: false },
    },
    payments: {
      mercadoPago: { enabled: true, publicKey: "", accessToken: "" },
      stripe: { enabled: false, publicKey: "", secretKey: "" },
      bankTransfer: { enabled: true, instructions: "Transferir a CBU 000-0000000-0" },
      cashOnDelivery: { enabled: false, fee: 0 },
    },
    shipping: {
      provider: "custom",
      flatRate: 2500,
      freeThreshold: 60000,
      pickupEnabled: true,
      zones: [
        { name: "CABA", rate: 1500 },
        { name: "GBA", rate: 2000 },
      ],
    },
    security: {
      passwordMinLength: 8,
      requireStrongPassword: true,
      twoFactorAuth: false,
      sessionTimeoutMinutes: 60,
      recaptchaSiteKey: "",
      recaptchaSecretKey: "",
    },
    notifications: {
      smtp: { host: "smtp.example.com", port: 587, user: "", pass: "", from: "no-reply@pluxy3d.com" },
      templates: {
        orderCreated: true,
        orderShipped: true,
        orderDelivered: true,
        passwordReset: true,
        newsletterOptIn: false,
      },
    },
  }
}

async function readSettings() {
  try {
    const buf = await fs.readFile(dataFile, "utf8")
    return JSON.parse(buf)
  } catch (e) {
    return defaults()
  }
}

async function writeSettings(data: any) {
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf8")
}

export async function GET() {
  const data = await readSettings()
  return NextResponse.json(data, { status: 200 })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  // A light validation safeguard
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
  const current = await readSettings()
  const merged = { ...current, ...body }
  await writeSettings(merged)
  return NextResponse.json(merged, { status: 200 })
}
