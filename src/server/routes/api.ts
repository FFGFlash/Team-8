import { NextFunction, Request, Response, Router } from 'express'
import { STATUS_CODES } from 'http'
import { StatusError } from '../middleware/errorHandler'

const api = Router()

/**
 * Used to easily send standardized responses
 * @param res - The response object used to send the response
 * @param status - The status code of the response
 * @param data - The data to send
 * @param message - The message to send
 * @returns if the response was successfully sent
 */
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
 * Middleware constructor for handling 'OPTIONS' requests and 405 (METHOD NOT ALLOWED) requests
 * @param methods - The allowed HTTP methods
 * @returns Middleware function
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

//* /rest
api
  .get('/', (req, res) => {
    respond(res, 200, undefined, '1.0.0')
  })
  .all('/', allowedMethods('GET'))

//* /rest/profile/:username
api
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

//* /rest/profile
api
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
  .post('/profile', (req, res, next) => {
    !respond(res, 200) && next()
  })
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
  .delete('/profile', (req, res, next) => {
    !respond(res, 200) && next()
  })
  .all('/profile', allowedMethods('GET', 'POST', 'PUT', 'PATCH', 'DELETE'))

//* /rest/coffee
api
  .get('/coffee', () => {
    throw new StatusError('Sorry all out of coffee!', 418)
  })
  .post('/coffee', () => {
    throw new StatusError("I'm a teapot, I can't brew coffee!", 418)
  })
  .patch('/coffee', () => {
    throw new StatusError('Did you just try to update coffee?', 418)
  })
  .put('/coffee', () => {
    throw new StatusError('I refuse to be replaced with a coffee pot!', 418)
  })
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
