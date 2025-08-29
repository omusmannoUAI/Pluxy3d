#!/usr/bin/env node

/**
 * Script de optimización de imports para Pluxy3D
 * Convierte imports individuales a barrel exports para mejor tree-shaking
 */

// Función para encontrar archivos recursivamente
function findFiles(dir, pattern, files = []) {
  try {
    const items = fs.readdirSync(dir)

    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory() && !['node_modules', '.next', 'dist', 'build'].includes(item)) {
        findFiles(fullPath, pattern, files)
      } else if (stat.isFile() && pattern.test(item)) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    // Ignorar errores de permisos
  }

  return files
}

console.log('🔧 OPTIMIZANDO IMPORTS PARA MEJOR TREE-SHAKING...\n')

// Mapeo de componentes más utilizados para optimización prioritaria
const priorityComponents = {
  'button': 'Button',
  'card': ['Card', 'CardContent', 'CardDescription', 'CardFooter', 'CardHeader', 'CardTitle'],
  'input': 'Input',
  'label': 'Label',
  'tabs': ['Tabs', 'TabsContent', 'TabsList', 'TabsTrigger'],
  'select': ['Select', 'SelectContent', 'SelectItem', 'SelectTrigger', 'SelectValue'],
  'separator': 'Separator',
  'skeleton': 'Skeleton'
}

// Función para optimizar imports en un archivo
function optimizeFileImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8')
    let hasChanges = false
    const originalContent = content

    // Buscar y reemplazar imports individuales de componentes prioritarios
    Object.entries(priorityComponents).forEach(([componentFile, exports]) => {
      const exportList = Array.isArray(exports) ? exports : [exports]
      const importRegex = new RegExp(`import\\s*{\\s*(${exportList.join('|')})(?:\\s*,\\s*([^}]*))?\\s*}\\s*from\\s*['"]@/components/ui/${componentFile}['"]`, 'g')

      if (importRegex.test(content)) {
        // Si encontramos un import individual, lo reemplazamos con el barrel export
        content = content.replace(importRegex, (match, firstExport, restExports) => {
          const allExports = restExports ? `${firstExport}, ${restExports.trim()}` : firstExport
          return `import { ${allExports} } from "@/components/ui"`
        })
        hasChanges = true
      }
    })

    // Si hay cambios, escribir el archivo
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8')
      console.log(`✅ Optimizado: ${path.relative(process.cwd(), filePath)}`)
      return true
    }

    return false
  } catch (error) {
    console.log(`❌ Error procesando ${filePath}:`, error.message)
    return false
  }
}

// Función principal
async function optimizeImports() {
  try {
    // Buscar todos los archivos TypeScript/React
    const files = findFiles(process.cwd(), /\.(ts|tsx)$/)

    console.log(`📁 Encontrados ${files.length} archivos para procesar\n`)

    let optimizedCount = 0
    let processedCount = 0

    for (const file of files) {
      processedCount++
      if (optimizeFileImports(file)) {
        optimizedCount++
      }

      // Mostrar progreso cada 50 archivos
      if (processedCount % 50 === 0) {
        console.log(`📊 Progreso: ${processedCount}/${files.length} archivos procesados`)
      }
    }

    console.log(`\n🎉 OPTIMIZACIÓN COMPLETADA:`)
    console.log(`   📊 Archivos procesados: ${processedCount}`)
    console.log(`   ✅ Archivos optimizados: ${optimizedCount}`)
    console.log(`   📈 Tasa de optimización: ${((optimizedCount / processedCount) * 100).toFixed(1)}%`)

    if (optimizedCount > 0) {
      console.log(`\n💡 RECOMENDACIONES:`)
      console.log(`   • Ejecuta 'npm run build' para ver la reducción en bundle size`)
      console.log(`   • Los imports ahora usan tree-shaking automático`)
      console.log(`   • Bundle inicial debería ser más pequeño`)
    }

  } catch (error) {
    console.log('❌ Error en optimización:', error.message)
  }
}

// Ejecutar optimización
optimizeImports()
