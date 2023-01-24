import e from 'express'
import { join } from 'path'
import api from './routes/api'

const { NODE_ENV = 'production' } = process.env

const app = e()

if (NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const livereload = require('livereload')
  const livereloadServer = livereload.createServer()
  livereloadServer.watch(join(__dirname, 'public'))
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const connectLivereload = require('connect-livereload')
  app.use(connectLivereload())
}

app.use('*', (req, res, next) =>
  !req.headers.accept?.includes('text/html')
    ? next()
    : res.sendFile(join(__dirname, 'public/index.html'))
)

app.use('/rest', api)

app.use(e.static(join(__dirname, 'public')))

export default app
