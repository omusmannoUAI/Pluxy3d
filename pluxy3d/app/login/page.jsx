"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Cookie as Google, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, register, loading } = useAuth()

  const defaultTab = searchParams.get("tab") === "register" ? "register" : "login"
  const expired = searchParams.get("expired")

  /**
   * @type {[string, Function]} Email del usuario
   */
  const [email, setEmail] = useState("")

  /**
   * @type {[string, Function]} Contraseña del usuario
   */
  const [password, setPassword] = useState("")

  /**
   * @type {[string, Function]} Nombre del usuario (para registro)
   */
  const [name, setName] = useState("")

  /**
   * @type {[string|null, Function]} Mensaje de error
   */
  const [error, setError] = useState(null)

  /**
   * @type {[string|null, Function]} Mensaje de éxito
   */
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    if (expired) {
      setError("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.")
    }
  }, [expired])

  /**
   * Manejar inicio de sesión
   * @param {Event} e - Evento del formulario
   */
  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !password) {
      setError("Por favor, completa todos los campos")
      return
    }

    const result = await login(email, password)

    if (result.success) {
      setSuccess("¡Inicio de sesión exitoso! Redirigiendo...")
      setTimeout(() => {
        // Check if there is a redirect URL
        const redirect = searchParams.get("redirect") || "/cuenta"
        router.push(redirect)
      }, 1000)
    } else {
      setError(result.message || "Error al iniciar sesión")
    }
  }

  /**
   * Manejar registro
   * @param {Event} e - Evento del formulario
   */
  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name || !email || !password) {
      setError("Por favor, completa todos los campos")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    const result = await register({ name, email, password })

    if (result.success) {
      setSuccess("¡Registro exitoso! Redirigiendo...")
      setTimeout(() => {
        router.push("/cuenta")
      }, 1000)
    } else {
      setError(result.message || "Error al registrarse")
    }
  }

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">PLUXY 3D</CardTitle>
          <CardDescription>Inicia sesión o crea una cuenta para continuar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Éxito</AlertTitle>
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Crear Cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Contraseña</Label>
                    <Link href="/recuperar-password" className="text-sm text-purple-600 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>

              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-800 mb-2">Usuarios de prueba:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>
                    <strong>Cliente:</strong> juan@example.com / 123456
                  </p>
                  <p>
                    <strong>Admin:</strong> admin@pluxy3d.com / admin123
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">E-mail</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">La contraseña debe tener al menos 6 caracteres</p>
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">O continuar con</span>
            </div>
          </div>

          <Button variant="outline" className="w-full bg-transparent" disabled={loading}>
            <Google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          <p>
            Al continuar, aceptas nuestros{" "}
            <Link href="/terminos" className="text-purple-600 hover:underline">
              Términos de Servicio
            </Link>{" "}
            y{" "}
            <Link href="/privacidad" className="text-purple-600 hover:underline">
              Política de Privacidad
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] py-10">
      <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
