#!/usr/bin/env node

/**
 * Cleanup Script - Elimina archivos innecesarios y optimiza el proyecto
 */

const fs = require('fs')
const path = require('path')

console.log('🧹 Pluxy3D Cleanup & Optimization')
console.log('=====================================\n')

// Archivos y carpetas a eliminar
const TO_DELETE = [
  '.next',
  'node_modules/.cache',
  'coverage',
  '*.log',
  '.DS_Store',
  'Thumbs.db',
  'backup.bacpac',
  'base.bak',
  'script base.sql',
  'backup_repository',
  'legacy_backup',
  'ModernNetProject',
  'tools'
]

// Archivos a verificar si están siendo usados
const FILES_TO_CHECK = [
  'jest.config.js',
  'jest.setup.js',
  '.eslintrc.json',
  'postcss.config.mjs',
  'tailwind.config.ts',
  'tsconfig.tsbuildinfo'
]

function deletePath(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      if (fs.statSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true })
        console.log(`✅ Eliminado directorio: ${filePath}`)
      } else {
        fs.unlinkSync(filePath)
        console.log(`✅ Eliminado archivo: ${filePath}`)
      }
      return true
    }
  } catch (error) {
    console.log(`❌ Error eliminando ${filePath}:`, error.message)
  }
  return false
}

function getDirectorySize(dirPath) {
  let totalSize = 0
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true })
    for (const file of files) {
      const filePath = path.join(dirPath, file.name)
      if (file.isDirectory()) {
        totalSize += getDirectorySize(filePath)
      } else {
        totalSize += fs.statSync(filePath).size
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  return totalSize
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Calcular tamaño antes de la limpieza
const initialSize = getDirectorySize('.')
console.log(`📊 Tamaño inicial del proyecto: ${formatBytes(initialSize)}\n`)

// Eliminar archivos innecesarios
console.log('🗑️  Eliminando archivos innecesarios...')
let deletedCount = 0
let spaceSaved = 0

TO_DELETE.forEach(item => {
  const sizeBefore = getDirectorySize(item)
  if (deletePath(item)) {
    deletedCount++
    spaceSaved += sizeBefore
  }
})

// Verificar archivos opcionales
console.log('\n🔍 Verificando archivos opcionales...')
FILES_TO_CHECK.forEach(file => {
  if (fs.existsSync(file)) {
    const size = fs.statSync(file).size
    console.log(`⚠️  Archivo presente: ${file} (${formatBytes(size)})`)

    // Preguntar si eliminar (en un script interactivo esto sería mejor)
    // Por ahora, solo mostrar información
  }
})

// Calcular tamaño final
const finalSize = getDirectorySize('.')
const totalSaved = initialSize - finalSize

console.log('\n📊 Resultados de la limpieza:')
console.log(`   • Archivos eliminados: ${deletedCount}`)
console.log(`   • Espacio liberado: ${formatBytes(totalSaved)}`)
console.log(`   • Tamaño final: ${formatBytes(finalSize)}`)

console.log('\n💡 Recomendaciones adicionales:')
console.log('   • Ejecuta "npm audit fix" para actualizar dependencias')
console.log('   • Revisa package.json para eliminar scripts no utilizados')
console.log('   • Considera usar "npm ci" en producción para instalaciones más rápidas')
console.log('   • Configura un .gitignore más restrictivo')

console.log('\n✅ Limpieza completada!')
