/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuración optimizada para desarrollo
  ...(process.env.NODE_ENV === 'development' && {
    images: {
      unoptimized: true, // Más rápido en desarrollo
    },
  }),
  // Configuración para producción
  ...(process.env.NODE_ENV === 'production' && {
    images: {
      formats: ['image/webp', 'image/avif'],
      deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
      imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
      minimumCacheTTL: 60,
    },
    experimental: {
      optimizePackageImports: [
        '@radix-ui/react-icons',
        'lucide-react',
        'recharts',
        'react-hook-form',
        'date-fns'
      ],
    },
    webpack: (config) => {
      config.optimization.splitChunks.chunks = 'all'
      config.optimization.splitChunks.cacheGroups = {
        radix: {
          test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
          name: 'radix-ui',
          chunks: 'all',
          priority: 20,
          enforce: true,
        },
        icons: {
          test: /[\\/]node_modules[\\/](lucide-react|@radix-ui\/react-icons)[\\/]/,
          name: 'icons',
          chunks: 'all',
          priority: 15,
        },
        utils: {
          test: /[\\/]node_modules[\\/](clsx|tailwind-merge|class-variance-authority)[\\/]/,
          name: 'utils',
          chunks: 'all',
          priority: 10,
        },
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
          name: 'framework',
          chunks: 'all',
          priority: 30,
        },
      }
      return config
    },
    output: 'standalone',
    compress: true,
    async headers() {
      return [
        {
          source: '/_next/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/api/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400',
            },
          ],
        },
      ]
    },
  }),
}

export default nextConfig