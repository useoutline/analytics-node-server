import cors from '@fastify/cors'
import trackingRoutes from './tracking.routes.js'

export function registerRoutes(fastify) {
  fastify.register((fastify, opts, done) => {
    fastify.register(cors, () => {
      return (req, callback) => {
        const corsOptions = {
          origin: '*',
          methods: ['GET', 'POST', 'OPTIONS'],
        }

        callback(null, corsOptions)
      }
    })
    fastify.register(trackingRoutes, { prefix: '/v1/:analyticsId' })
    done()
  })
}
