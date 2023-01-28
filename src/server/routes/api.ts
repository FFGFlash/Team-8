import { NextFunction, Request, Response, Router } from 'express'
import { STATUS_CODES } from 'http'
import { StatusError } from '../middleware/errorHandler'

const api = Router()

function respond(
  res: Response,
  status: number,
  data: any = {},
  message?: string
) {
  if (res.headersSent) return false
  res.status(status).json({
    message: message || STATUS_CODES[status],
    status,
    data
  })
  return true
}

/**
 *
 * @param methods
 * @returns
 */
function allowedMethods(...methods: RequestMethod[]) {
  !methods.includes('OPTIONS') && methods.push('OPTIONS')
  methods.includes('GET') && methods.push('HEAD')
  const Allow = methods.join(',')
  return (req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next()
    res
      .writeHead(req.method === 'OPTIONS' ? 204 : 405, {
        Allow
      })
      .end()
  }
}

api
  //* GET: /rest/profile/:username - gets the public profile of the provided username
  .get('/profile/:username', (req, res, next) => {
    const { username } = req.params
    !respond(res, 200, {
      profile: {
        username,
        email: `${username}@timtam.com`,
        firstName: username,
        lastName: 'Tam'
      }
    }) && next()
  })
  .all('/profile/:username', allowedMethods('GET'))

api
  //* GET: /rest/profile - gets the profile of the currently logged in user
  .get('/profile', (req, res, next) => {
    !respond(res, 200, {
      profile: {
        username: 'TheTimTam',
        email: 'tim&timtam.com',
        password: '5f4dcc3b5aa765d61d8327deb882cf99',
        firstName: 'Tim',
        lastName: 'Tam'
      }
    }) && next()
  })
  //* POST: /rest/profile - create a new profile or sign in to an existing profile
  .post('/profile', (req, res, next) => {
    !respond(res, 200) && next()
  })
  //* PUT: /rest/profile - updates the critical information of the currently logged in user
  .put('/profile', (req, res, next) => {
    !respond(res, 200, {
      profile: {
        username: 'Tim',
        email: 'tim&timtam.com',
        password: 'f1086f68460b65771de50a970cd1242d',
        firstName: 'Tim',
        lastName: 'Tam'
      }
    }) && next()
  })
  //* PATCH: /rest/profile - updates the non-critical information of the currently logged in user
  .patch('/profile', (req, res, next) => {
    !respond(res, 200, {
      profile: {
        username: 'Tim',
        email: 'tim&timtam.com',
        password: '5f4dcc3b5aa765d61d8327deb882cf99',
        firstName: 'Timothy',
        lastName: 'Tammy'
      }
    }) && next()
  })
  //* DELETE: /rest/profile - deletes the currently logged in user
  .delete('/profile', (req, res, next) => {
    !respond(res, 200) && next()
  })
  .all('/profile', allowedMethods('GET', 'POST', 'PUT', 'PATCH', 'DELETE'))

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
  .all('/coffee', allowedMethods('GET', 'POST', 'PUT', 'PATCH', 'DELETE'))

api.use(() => {
  throw new StatusError('Invalid api endpoint', 404)
})

export default api
