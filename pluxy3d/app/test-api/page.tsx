"use client"

import { useEffect, useState } from "react"

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API connection...')
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5299/api'
        console.log('Using API URL:', API_URL)
        
        const response = await fetch(`${API_URL}/productos`)
        console.log('Response status:', response.status)
        console.log('Response ok:', response.ok)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Data received:', data)
        
        setResult(data)
        setLoading(false)
      } catch (err) {
        console.error('API test failed:', err)
        setError(err instanceof Error ? err.message : String(err))
        setLoading(false)
      }
    }
    
    testApi()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 p-4 rounded">
          <p className="text-green-800">Success! Received data:</p>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}