import { AddressInfo } from 'net'
import app from './app'

const { PORT = 3000 } = process.env

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Server listening on port ${(server.address() as AddressInfo).port}`
  )
})
