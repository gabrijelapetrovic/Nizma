import { copyFileSync, createReadStream, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const root = path.dirname(fileURLToPath(import.meta.url))
const srcAssets = path.join(root, 'src/assets')
const publicAssets = path.join(root, 'public/assets')

const IMAGE_MIME: Record<string, string> = {
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
}

function isInside(parent: string, child: string) {
  const from = path.resolve(parent)
  const to = path.resolve(child)
  return to === from || to.startsWith(from + path.sep)
}

function copyTree(fromDir: string, toDir: string) {
  if (!existsSync(fromDir)) return
  mkdirSync(toDir, { recursive: true })
  for (const name of readdirSync(fromDir)) {
    if (name.startsWith('.')) continue
    const from = path.join(fromDir, name)
    const to = path.join(toDir, name)
    if (statSync(from).isDirectory()) {
      copyTree(from, to)
      continue
    }
    copyFileSync(from, to)
  }
}

function resolveAssetFile(url: string): string | null {
  const rel = decodeURIComponent(url.slice('/assets/'.length))
  if (!rel) return null
  const pub = path.join(publicAssets, rel)
  const src = path.join(srcAssets, rel)
  if (isInside(publicAssets, pub) && existsSync(pub) && statSync(pub).isFile()) return pub
  if (isInside(srcAssets, src) && existsSync(src) && statSync(src).isFile()) return src
  return null
}

/** Serve/copy `src/assets/*` at `/assets/*` (public/assets wins if both exist). */
function serveSrcAssets(): Plugin {
  return {
    name: 'serve-src-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (url.includes('..') || !url.startsWith('/assets/')) return next()
        const ext = path.extname(url).toLowerCase()
        if (!IMAGE_MIME[ext]) return next()
        const filePath = resolveAssetFile(url)
        if (!filePath) return next()
        res.setHeader('Content-Type', IMAGE_MIME[ext])
        res.setHeader('Cache-Control', 'no-cache')
        createReadStream(filePath).pipe(res)
      })
    },
    closeBundle() {
      copyTree(srcAssets, path.join(root, 'dist/assets'))
    },
  }
}

export default defineConfig({
  plugins: [serveSrcAssets(), react(), tailwindcss()],
  build: {
    target: 'es2022',
    minify: 'oxc',
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'react';
          if (id.includes('node_modules/lucide-react')) return 'icons';
          return undefined;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 600,
    cssCodeSplit: false,
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
