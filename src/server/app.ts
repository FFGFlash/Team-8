import cookieParser from 'cookie-parser'
import e, { json, urlencoded } from 'express'
import { join } from 'path'
import errorHandler, { StatusError } from './middleware/errorHandler'
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

app.use(json(), urlencoded({ extended: true }), cookieParser())

app.use('*', (req, res, next) =>
  !req.headers.accept?.includes('text/html')
    ? next()
    : res.sendFile(join(__dirname, 'public/index.html'))
)

app.use('/rest', api)

app.use(e.static(join(__dirname, 'public')), () => {
  throw new StatusError('File not found', 404)
})

app.use(errorHandler)

export default app
