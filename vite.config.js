import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { handleApiRoute } from './api.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'solstice-backend-api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith('/api')) {
            try {
              const handled = await handleApiRoute(req, res)
              if (!handled) next()
            } catch (err) {
              console.error('API middleware error:', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Internal API error' }))
            }
          } else {
            next()
          }
        })
      }
    }
  ],
})
