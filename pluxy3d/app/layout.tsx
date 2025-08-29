import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/contexts/CartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Toaster } from 'react-hot-toast'
import { ServiceWorkerProvider } from "@/components/ServiceWorkerProvider"
import { CacheManager } from "@/components/CacheManager"
import { CartDiagnostics } from "@/components/CartDiagnostics"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pluxy 3D - Tienda de Impresoras 3D",
  description: "Compra y venta de impresoras 3D, componentes y servicio técnico",
  generator: 'v0.dev',
  metadataBase: new URL('http://localhost:3000'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <ServiceWorkerProvider />
                <CacheManager />
                <CartDiagnostics />
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
          }}
        />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
