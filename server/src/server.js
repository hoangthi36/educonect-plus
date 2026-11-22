import http from 'node:http'
import { createApp } from './app.js'
import { connectDatabase, disconnectDatabase } from './config/database.js'
import { readConfig } from './config/env.js'

const config = readConfig()
await connectDatabase(config.mongoUri)

const app = createApp({ config })
const server = http.createServer(app)

server.listen(config.port, '0.0.0.0', () => {
  console.log(`Educonect+ server listening on port ${config.port}.`)
})

async function shutdown(signal) {
  console.log(`Received ${signal}; shutting down.`)
  server.close(async () => {
    await disconnectDatabase()
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10_000).unref()
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
