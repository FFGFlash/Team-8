if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { config } = require('dotenv')
  config()
}

import { createServer } from 'http'
import { AddressInfo } from 'net'
import expressApp from './app'
import createSocket from './socket'
import { initializeApp } from 'firebase-admin/app'
import { credential } from 'firebase-admin'

const { PORT = 3000 } = process.env

initializeApp({
  credential: credential.applicationDefault()
})

export default function app() {
  const server = createServer(expressApp)
  createSocket(server)
  return server
}

if (process.env.NODE_ENV === 'development') {
  const server = app()

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Server listening on port ${(server.address() as AddressInfo).port}`
    )
  })
}
