import { Router } from 'express'
import { getApp } from 'firebase-admin/app'
import { StatusError } from '../middleware/errorHandler'

const app = getApp()

const api = Router()

api.get('/coffee', (req, res) => {
  res.status(418).json({
    status: 418,
    message: 'I refuse to brew your coffee! For I am a teapot'
  })
})

api.use(() => {
  throw new StatusError('Invalid api endpoint', 404)
})

export default api
