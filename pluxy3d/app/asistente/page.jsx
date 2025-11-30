"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Send, Loader2 } from "lucide-react"

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hola, soy el asistente de PLUXY 3D. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setMessages((prev) => [...prev, { id: prev.length + 1, text: input, sender: "user" }])
    setInput("")
    setLoading(true)

    // Simular respuesta del bot
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: prev.length + 1, text: "Gracias por tu pregunta. Un especialista te responderá pronto.", sender: "bot" },
      ])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Link>
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Asistente IA</h1>
        <p className="text-muted-foreground mb-8">Obtén ayuda inmediata con tus preguntas sobre impresoras 3D</p>

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Chat de Soporte</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </CardContent>

          <form onSubmit={handleSend} className="flex gap-2 p-4 border-t">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
            />
            <Button type="submit" size="icon" className="bg-purple-600 hover:bg-purple-700" disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
