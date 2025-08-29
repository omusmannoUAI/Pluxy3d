#!/usr/bin/env node

/**
 * Script de benchmarking simple de performance para Pluxy3D
 * Mide tiempos de carga básicos usando fetch
 */

const fs = require('fs')
const path = require('path')
const http = require('http')

const BASE_URL = 'http://localhost:3000'
const PAGES_TO_TEST = [
  '/',
  '/productos',
  '/personalizacion',
  '/soporte',
  '/nosotros',
  '/contacto'
]

const RESULTS_FILE = path.join(__dirname, 'performance-results.json')

async function measurePageLoad(url) {
  const startTime = Date.now()

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Performance-Benchmark/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    // Leer el contenido completo
    const content = await response.text()
    const loadTime = Date.now() - startTime

    // Estimaciones básicas
    const hasLoadingState = content.includes('animate-spin') || content.includes('skeleton')
    const hasServiceWorker = content.includes('serviceWorker')

    return {
      url,
      loadTime,
      contentLength: content.length,
      hasLoadingState,
      hasServiceWorker,
      success: true
    }

  } catch (error) {
    return {
      url,
      loadTime: Date.now() - startTime,
      error: error.message,
      success: false
    }
  }
}

async function waitForServer() {
  console.log('⏳ Esperando que el servidor esté listo...')

  for (let i = 0; i < 30; i++) {
    try {
      const response = await fetch(BASE_URL, { timeout: 5000 })
      if (response.ok) {
        console.log('✅ Servidor listo')
        return true
      }
    } catch (error) {
      // Continuar intentando
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('❌ Servidor no respondió después de 30 segundos')
  return false
}

async function runBenchmark() {
  console.log('🚀 INICIANDO BENCHMARK DE PERFORMANCE...\n')

  // Esperar que el servidor esté listo
  const serverReady = await waitForServer()
  if (!serverReady) {
    console.log('❌ No se pudo conectar al servidor. Asegúrate de que esté corriendo en http://localhost:3000')
    return
  }

  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    results: []
  }

  for (const pagePath of PAGES_TO_TEST) {
    const url = BASE_URL + pagePath
    console.log(`📊 Midiendo: ${url}`)

    const result = await measurePageLoad(url)
    results.results.push(result)

    if (result.success) {
      console.log(`   ✅ ${result.loadTime}ms (${(result.contentLength / 1024).toFixed(1)}KB)`)
      console.log(`      Loading state: ${result.hasLoadingState ? '✅' : '❌'}`)
      console.log(`      Service Worker: ${result.hasServiceWorker ? '✅' : '❌'}`)
    } else {
      console.log(`   ❌ Error: ${result.error}`)
    }

    // Pequeña pausa entre mediciones
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Guardar resultados
  let history = []
  if (fs.existsSync(RESULTS_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'))
    } catch (e) {
      console.log('⚠️  No se pudo leer el historial anterior')
    }
  }

  history.push(results)
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(history, null, 2))

  // Mostrar comparación con medición anterior
  if (history.length > 1) {
    const previous = history[history.length - 2]
    console.log('\n📈 COMPARACIÓN CON MEDICIÓN ANTERIOR:')

    results.results.forEach((current, index) => {
      const prev = previous.results[index]
      if (prev && current.success && prev.success) {
        const diff = current.loadTime - prev.loadTime
        const symbol = diff > 0 ? '🔴' : diff < 0 ? '🟢' : '🟡'
        const change = diff > 0 ? `+${diff}ms` : diff < 0 ? `${diff}ms` : '0ms'
        console.log(`   ${symbol} ${current.url}: ${change}`)
      }
    })
  }

  // Resumen
  const successful = results.results.filter(r => r.success)
  const avgLoadTime = successful.reduce((sum, r) => sum + r.loadTime, 0) / successful.length

  console.log('\n📊 RESUMEN:')
  console.log(`   Páginas probadas: ${results.results.length}`)
  console.log(`   Exitosas: ${successful.length}`)
  console.log(`   Tiempo promedio: ${avgLoadTime.toFixed(0)}ms`)
  console.log(`   Loading states: ${successful.filter(r => r.hasLoadingState).length}/${successful.length}`)
  console.log(`   Service Worker: ${successful.filter(r => r.hasServiceWorker).length}/${successful.length}`)

  console.log('\n✨ Benchmark completado. Resultados guardados en performance-results.json')
}

// Ejecutar benchmark si se llama directamente
if (require.main === module) {
  runBenchmark().catch(console.error)
}

module.exports = { runBenchmark }
