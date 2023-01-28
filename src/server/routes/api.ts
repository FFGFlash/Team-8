import { Response, Router } from 'express'
import { auth } from 'firebase-admin'
import { getApp } from 'firebase-admin/app'
import { STATUS_CODES } from 'http'
import { StatusError } from '../middleware/errorHandler'

const app = getApp()

const api = Router()

function respond(
  res: Response,
  status: number,
  data: any = {},
  message?: string
) {
  return res.status(status).json({
    message: message || STATUS_CODES[status],
    status,
    data
  })
}

//* GET: /rest/profile/:username - gets the public profile of the provided username
api.get('/profile/:username', (req, res) => {
  const { username } = req.params
  respond(res, 200, {
    profile: {
      username,
      email: `${username}@timtam.com`
    }
  })
})

api
  //* GET: /rest/profile - gets the profile of the currently logged in user
  .get('/profile', (req, res) => {
    respond(res, 200, {
      profile: {
        username: 'Tim',
        email: 'tim&timtam.com',
        password: '5f4dcc3b5aa765d61d8327deb882cf99'
      }
    })
  })
  //* POST: /rest/profile - create a new profile or sign in to an existing profile
  .post('/profile', (req, res) => {
    respond(res, 200)
  })
  //* PATCH: /rest/profile - updates the profile of the currently logged in user
  .patch('/profile', (req, res) => {
    respond(res, 200, {
      profile: {
        username: 'Tim',
        email: 'tim&timtam.com',
        password: 'f1086f68460b65771de50a970cd1242d'
      }
    })
  })
  //* DELETE: /rest/profile - deletes the currently logged in user
  .delete('/profile', (req, res) => {
    respond(res, 200)
  })

api
  //* GET: /rest/coffee - attempts to get some coffee from the pot
  .get('/coffee', () => {
    throw new StatusError('Sorry all out of coffee!', 418)
  })
  //* POST: /rest/coffee - attempts to brew some coffee
  .post('/coffee', () => {
    throw new StatusError("I'm a teapot, I can't brew coffee!", 418)
  })
  //* PATCH: /rest/coffee - attempts to update coffee?
  .patch('/coffee', () => {
    throw new StatusError('Did you just try to update coffee?', 418)
  })
  //* PUT: /rest/coffee - attempts to replace the teapot with a coffee pot
  .put('/coffee', () => {
    throw new StatusError('I refuse to be replaced with a coffee pot!', 418)
  })
  //* DELETE: /rest/coffee - attempts to delete the coffee pot
  .delete('/coffee', () => {
    throw new StatusError(
      'You really tried to delete the non-existent coffee?',
      418
    )
  })

api.use(() => {
  throw new StatusError('Invalid api endpoint', 404)
})

export default api
