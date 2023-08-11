import fastifyServer from 'fastify'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cron from 'node-cron'
import fs from 'fs'

import { downloadMaxmindDB } from './utils/maxmind.js'
import { registerRoutes } from './routes/registerRoutes.js'

dotenv.config()

let fastifyOptions = {}

if (process.env.SSL_KEY && process.env.SSL_CERT) {
  const sslKey = fs.readFileSync(process.env.SSL_KEY, 'utf8')
  const sslCert = fs.readFileSync(process.env.SSL_CERT, 'utf8')
  fastifyOptions = {
    https: {
      key: sslKey,
      cert: sslCert,
    },
  }
}

if (process.env.NODE_ENV === 'production') {
  fastifyOptions.logger = { level: 'info' }
  fastifyOptions.trustProxy = true
}

const fastify = fastifyServer(fastifyOptions)
registerRoutes(fastify)

const start = async () => {
  try {
    let server = await fastify.listen({
      port: process.env.PORT || 3000,
      host: process.env.HOST || '127.0.0.1',
    })
    await mongoose.connect(process.env.MONGO_URL)
    downloadMaxmindDB() // Download DB on server start
    cron.schedule('12 0 * * 3,6', downloadMaxmindDB) // Download new DB every Wednesday and Saturday at 12:00 PM
    console.log(`Server started at ${server}`)
  } catch (err) {
    console.log(err)
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
