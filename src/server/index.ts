import { createServer } from 'http'
import { AddressInfo } from 'net'
import './firebase'
import app from './app'
import createSocket from './socket'

const { PORT = 3000 } = process.env
const server = createServer(app)

createSocket(server)

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Server listening on port ${(server.address() as AddressInfo).port}`
  )
})
