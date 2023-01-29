import { ErrorRequestHandler } from 'express'

export class StatusError {
  message: string
  status: number
  data

  constructor(
    message?: string,
    status = 500,
    data: { [key: string]: any } = {}
  ) {
    this.message = message || 'Unknown error occurred'
    this.status = status
    this.data = data
  }
}

const errorHandler: ErrorRequestHandler = (
  err: StatusError | Error,
  req,
  res,
  next
) => {
  const serr =
    err instanceof StatusError
      ? err
      : new StatusError('Looks like something went wrong on our end!')
  const accept = req.headers.accept || 'application/json'
  res.headersSent
    ? next(err)
    : accept.includes('application/json')
    ? res.status(serr.status).json(serr)
    : res.sendStatus(serr.status)
  if (serr.status >= 500 && serr.status < 600) console.error(err.message)
}
export default errorHandler
