if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { config } = require('dotenv')
  config()
}

import { createServer } from 'http'
import { AddressInfo } from 'net'
import app from './app'
import createSocket from './socket'
import { initializeApp } from 'firebase-admin/app'
import { credential } from 'firebase-admin'

const { PORT = 3000 } = process.env

initializeApp({
  credential: credential.applicationDefault()
})

const server = createServer(app)

createSocket(server)

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Server listening on port ${(server.address() as AddressInfo).port}`
  )
})
