#!/usr/bin/env node

/**
 * Script avanzado de análisis de performance para Pluxy3D
 * Identifica cuellos de botella específicos y sugiere optimizaciones precisas
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 ANALIZANDO PERFORMANCE DE PLUXY3D...\n')

// Análisis del bundle
function analyzeBundle() {
  console.log('📦 ANALIZANDO BUNDLE SIZE...')

  const nextDir = path.join(__dirname, '..', '.next')
  if (!fs.existsSync(nextDir)) {
    console.log('❌ No se encontró directorio .next - ejecutar build primero')
    return
  }

  try {
    const staticDir = path.join(nextDir, 'static')
    if (fs.existsSync(staticDir)) {
      const chunksDir = path.join(staticDir, 'chunks')
      if (fs.existsSync(chunksDir)) {
        const files = fs.readdirSync(chunksDir)
        const jsFiles = files.filter(f => f.endsWith('.js'))

        console.log(`� Encontrados ${jsFiles.length} chunks JavaScript`)

        let totalSize = 0
        let largeChunks = []

        jsFiles.forEach(file => {
          const filePath = path.join(chunksDir, file)
          const stats = fs.statSync(filePath)
          totalSize += stats.size

          if (stats.size > 100000) { // > 100KB
            largeChunks.push({ name: file, size: stats.size })
          }
        })

        console.log(`📈 Tamaño total del bundle: ${(totalSize / 1024 / 1024).toFixed(2)}MB`)

        if (largeChunks.length > 0) {
          console.log('⚠️  Chunks grandes detectados:')
          largeChunks.forEach(chunk => {
            console.log(`   - ${chunk.name}: ${(chunk.size / 1024).toFixed(1)}KB`)
          })
        }

        console.log('')
      }
    }
  } catch (error) {
    console.log('❌ Error analizando bundle:', error.message)
  }
}

// Análisis de dependencias
function analyzeDependencies() {
  console.log('🔍 ANALIZANDO DEPENDENCIAS...')

  const packagePath = path.join(__dirname, '..', 'package.json')
  if (!fs.existsSync(packagePath)) {
    console.log('❌ No se encontró package.json')
    return
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

    const radixComponents = Object.keys(dependencies).filter(dep =>
      dep.startsWith('@radix-ui/react-')
    )

    console.log(`🎨 Componentes Radix UI: ${radixComponents.length}`)
    if (radixComponents.length > 10) {
      console.log('⚠️  Muchos componentes Radix UI pueden causar bundle splitting excesivo')
      console.log('💡 Recomendación: Importar solo los componentes necesarios')
    }

    const largeDeps = ['recharts', 'react-hook-form', 'date-fns', 'lucide-react']
    console.log('\n📚 Dependencias grandes encontradas:')
    largeDeps.forEach(dep => {
      if (dependencies[dep]) {
        console.log(`   - ${dep}: ${dependencies[dep]}`)
      }
    })

    console.log('')
  } catch (error) {
    console.log('❌ Error analizando dependencias:', error.message)
  }
}

// Análisis de configuración
function analyzeConfig() {
  console.log('⚙️  ANALIZANDO CONFIGURACIÓN...')

  const configPath = path.join(__dirname, '..', 'next.config.mjs')
  if (!fs.existsSync(configPath)) {
    console.log('❌ No se encontró next.config.mjs')
    return
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf8')

    if (configContent.includes('unoptimized: true')) {
      console.log('❌ Optimización de imágenes DESHABILITADA')
    } else {
      console.log('✅ Optimización de imágenes habilitada')
    }

    if (configContent.includes('optimizePackageImports')) {
      console.log('✅ Optimización de imports de paquetes habilitada')
    } else {
      console.log('⚠️  Optimización de imports de paquetes no configurada')
    }

    if (configContent.includes('swcMinify')) {
      console.log('✅ Minificación SWC habilitada')
    } else {
      console.log('⚠️  Minificación SWC no configurada')
    }

    if (configContent.includes('splitChunks')) {
      console.log('✅ Bundle splitting personalizado configurado')
    } else {
      console.log('⚠️  Bundle splitting no optimizado')
    }

    console.log('')
  } catch (error) {
    console.log('❌ Error analizando configuración:', error.message)
  }
}

// Análisis de componentes
function analyzeComponents() {
  console.log('🧩 ANALIZANDO COMPONENTES...')

  const componentsDir = path.join(__dirname, '..', 'components')
  if (!fs.existsSync(componentsDir)) {
    console.log('❌ No se encontró directorio components')
    return
  }

  try {
    let totalComponents = 0
    let largeComponents = []

    function scanDirectory(dir, prefix = '') {
      const items = fs.readdirSync(dir)

      items.forEach(item => {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          scanDirectory(fullPath, prefix + item + '/')
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          totalComponents++
          const content = fs.readFileSync(fullPath, 'utf8')

          // Verificar imports pesados
          const heavyImports = [
            /import.*recharts/,
            /import.*@radix-ui/,
            /import.*lucide-react/
          ]

          const hasHeavyImports = heavyImports.some(pattern => pattern.test(content))

          if (hasHeavyImports && stat.size > 5000) { // > 5KB
            largeComponents.push({
              name: prefix + item,
              size: stat.size,
              hasHeavyImports
            })
          }
        }
      })
    }

    scanDirectory(componentsDir)

    console.log(`📊 Total de componentes: ${totalComponents}`)

    if (largeComponents.length > 0) {
      console.log('⚠️  Componentes que pueden beneficiarse de lazy loading:')
      largeComponents.forEach(comp => {
        console.log(`   - ${comp.name}: ${(comp.size / 1024).toFixed(1)}KB ${comp.hasHeavyImports ? '(imports pesados)' : ''}`)
      })
    }

    console.log('')
  } catch (error) {
    console.log('❌ Error analizando componentes:', error.message)
  }
}

// Recomendaciones específicas
function printRecommendations() {
  console.log('💡 RECOMENDACIONES DE OPTIMIZACIÓN PRIORITARIAS:')
  console.log('')

  console.log('🚨 CRÍTICO - TIEMPOS DE COMPILACIÓN:')
  console.log('   ▶ Implementar lazy loading para rutas pesadas (/personalizacion, /admin/resumen)')
  console.log('   ▶ Usar dynamic imports: const Component = dynamic(() => import("./Component"))')
  console.log('   ▶ Crear loading.tsx para cada ruta con skeleton loaders')
  console.log('')

  console.log('📦 CRÍTICO - BUNDLE SIZE:')
  console.log('   ▶ Consolidar componentes Radix UI en imports específicos')
  console.log('   ▶ Implementar code splitting por rutas principales')
  console.log('   ▶ Usar tree-shaking para eliminar código no utilizado')
  console.log('')

  console.log('⚡ MEDIO - RENDIMIENTO EN TIEMPO REAL:')
  console.log('   ▶ Habilitar optimización de imágenes de Next.js')
  console.log('   ▶ Implementar React.memo para componentes caros')
  console.log('   ▶ Optimizar re-renders con useMemo/useCallback')
  console.log('')

  console.log('🔧 MEDIO - CONFIGURACIÓN:')
  console.log('   ▶ Habilitar SWC minification en next.config.mjs')
  console.log('   ▶ Configurar headers de cache agresivos')
  console.log('   ▶ Optimizar webpack bundle splitting')
  console.log('')

  console.log('🎯 ACCIONES INMEDIATAS:')
  console.log('   1. Ejecutar: npm run build:analyze')
  console.log('   2. Revisar webpack-bundle-analyzer output')
  console.log('   3. Implementar lazy loading en rutas críticas')
  console.log('   4. Probar tiempos después de cada cambio')
}

// Ejecutar análisis completo
analyzeBundle()
analyzeDependencies()
analyzeConfig()
analyzeComponents()
printRecommendations()

console.log('\n✨ Análisis completado. Ejecuta este script después de cada optimización para medir progreso.')
