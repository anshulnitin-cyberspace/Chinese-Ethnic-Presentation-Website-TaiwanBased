import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { copyFile, link, mkdir } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROOT_MEDIA_FILES } from './src/config/media.js'

const rootDir = dirname(fileURLToPath(import.meta.url))

/**
 * The cinema reel is too large to commit, so it lives in the project root
 * (git-ignored). Vite serves the root in `dev`, but a build only copies
 * `public/`. This plugin mirrors every file listed in `ROOT_MEDIA_FILES` into
 * `dist/` so the same root-relative URL keeps working locally.
 *
 * A hard link is used when possible (instant, no extra disk space); otherwise
 * the file is copied. Missing files (or remote URLs) are skipped with a
 * warning instead of failing the build — production can set
 * `VITE_CINEMA_VIDEO_URL` to a hosted copy instead.
 */
function copyRootMedia() {
  return {
    name: 'copy-root-media',
    apply: 'build',
    async writeBundle(options) {
      const outDir = options.dir
        ? resolve(rootDir, options.dir)
        : join(rootDir, 'dist')
      const notify = this.warn.bind(this)

      for (const file of ROOT_MEDIA_FILES) {
        if (/^(?:https?:)?\/\//i.test(file)) continue

        const relative = file.replace(/^\/+/, '')
        const from = join(rootDir, relative)
        const to = join(outDir, relative)

        await mkdir(dirname(to), { recursive: true })

        try {
          await link(from, to)
        } catch {
          try {
            await copyFile(from, to)
          } catch (error) {
            notify(
              `[copy-root-media] Could not copy "${relative}" into the build (${error.code ?? error.message}). Drop the file in the project root to include it.`,
            )
          }
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyRootMedia()],
  server: {
    watch: {
      // Image editors and upscalers drop temporary files into the project root.
      // Watching those files can crash the dev server with EBUSY on Windows.
      ignored: [
        '**/.git/**',
        '**/node_modules/**',
        '**/*.tmp',
        '**/~*',
        '**/*.crdownload',
        '**/*.partial',
      ],
    },
  },
})
