import { NextFunction, Request, Response, Router } from 'express'
import { STATUS_CODES } from 'http'
import { PostProfileBody } from 'src/client/api/profile'
import { StatusError } from '../middleware/errorHandler'

import { getAuth, DecodedIdToken } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getApp } from 'firebase-admin/app'

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

api.use(async (req, res, next) => {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const token = req.headers.authorization.split('Bearer ')[1]
    try {
      const user = await getAuth(getApp()).verifyIdToken(token)
      res.locals.user = user
    } catch (err) {
      res.locals.user = null
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }
  next()
})

//* /rest
api
  .get('/', (req, res) => {
    respond(res, 200, undefined, '1.0.0')
  })
  .all('/', allowedMethods('GET'))

//* /rest/profile/:uid
api
  .get('/profile/:uid', async (req, res, next) => {
    const { uid } = req.params
    const profileRef = getFirestore().collection('users').doc(uid)
    const profileSnap = await profileRef.get()
    if (!profileSnap.exists) throw new StatusError(STATUS_CODES[404], 404)
    !respond(res, 200, profileSnap.data()) && next()
  })
  .all('/profile/:username', allowedMethods('GET'))

//* /rest/profile
api
  .get('/profile', (_, res, next) => {
    const user = res.locals.user as DecodedIdToken
    if (!user) throw new StatusError(STATUS_CODES[401], 401)
    const profileRef = getFirestore().collection('users').doc(user.uid)
    profileRef.get().then(snap => {
      if (!snap.exists) throw new StatusError(STATUS_CODES[404], 404)
      !respond(res, 200, snap.data()) && next()
    })
  })
  .post('/profile', async (req, res, next) => {
    const user = res.locals.user as DecodedIdToken
    if (!user) throw new StatusError(STATUS_CODES[401], 401)
    const { displayName, firstName, lastName } = req.body as PostProfileBody
    const profileRef = getFirestore().collection('users').doc(user.uid)
    const data = { displayName, firstName, lastName }
    await profileRef.set(data)
    !respond(res, 201, data) && next()
  })
  .patch('/profile', async (req, res, next) => {
    const user = res.locals.user as DecodedIdToken
    if (!user) throw new StatusError(STATUS_CODES[401], 401)
    const { displayName, firstName, lastName } = req.body as PostProfileBody
    const profileRef = getFirestore().collection('users').doc(user.uid)
    const profileSnap = await profileRef.get()
    if (!profileSnap.exists) throw new StatusError(STATUS_CODES[404], 404)
    const data = { displayName, firstName, lastName }
    await profileRef.update(data)
    !respond(res, 200, data) && next()
  })
  .delete('/profile', async (_, res, next) => {
    const user = res.locals.user as DecodedIdToken
    if (!user) throw new StatusError(STATUS_CODES[401], 401)
    const profileRef = getFirestore().collection('users').doc(user.uid)
    const profileSnap = await profileRef.get()
    if (!profileSnap.exists) throw new StatusError(STATUS_CODES[404], 404)
    await profileRef.delete()
    !respond(res, 200) && next()
  })
  .all('/profile', allowedMethods('GET', 'POST', 'PATCH', 'DELETE'))

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
