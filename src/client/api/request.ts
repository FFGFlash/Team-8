import { getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export type ParamResolvable = string | number | boolean

const auth = getAuth(getApp())

export interface RequestParams {
  [key: string]: ParamResolvable | ParamResolvable[]
}

export interface RequestOptions extends RequestInit {
  method?: RequestMethod
  body?: any
  headers?: Record<string, string>
}

function debug(message: any, ...args: any[]) {
  // eslint-disable-next-line no-console
  return process.env.NODE_ENV === 'development' && console.log(message, ...args)
}

export default class Request<
  GetParams extends object,
  GetResponse extends ApiResponse,
  PostBody,
  PostResponse extends ApiResponse,
  PatchBody,
  PatchResponse extends ApiResponse,
  PutBody,
  PutResponse extends ApiResponse,
  DeleteBody,
  DeleteResponse extends ApiResponse
> {
  readonly endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  get(params?: GetParams) {
    return Request.get<GetParams, ErrorResponse | GetResponse>(
      this.endpoint,
      params
    )
  }

  post(body?: PostBody) {
    return Request.post<PostBody, ErrorResponse | PostResponse>(
      this.endpoint,
      body
    )
  }

  patch(body?: PatchBody) {
    return Request.patch<PatchBody, ErrorResponse | PatchResponse>(
      this.endpoint,
      body
    )
  }

  put(body?: PutBody) {
    return Request.put<PutBody, ErrorResponse | PutResponse>(
      this.endpoint,
      body
    )
  }

  delete(body?: DeleteBody) {
    return Request.delete<DeleteBody, ErrorResponse | DeleteResponse>(
      this.endpoint,
      body
    )
  }

  options() {
    return Request.options<ApiResponse>(this.endpoint)
  }

  head(params?: GetParams) {
    return Request.head<GetParams, ApiResponse>(this.endpoint, params)
  }

  //* STATIC CONTENT BELOW

  static typeFilter = ['undefined']
  static valueFilter = [Infinity, NaN, null]

  /**
   * Creates a query string from an object
   * @param params - The object used to make the query string
   * @returns A query string
   */
  static parseParams(params?: object) {
    const retVal =
      params &&
      Object.entries(params)
        .filter(
          ([, value]) =>
            !this.typeFilter.includes(typeof value) &&
            !this.valueFilter.includes(value as any)
        )
        .map(
          ([key, value]) =>
            `${key}=${Array.isArray(value) ? value.join() : value}`
        )
        .join('&')
    return retVal && retVal.length > 0 ? `?${retVal}` : ''
  }

  /**
   * Used to send a request to a specific url
   * @param url - The url to request information from
   * @param options - The request options
   * @returns The response body
   */
  static async req<T>(url: string, options: RequestOptions = {}): Promise<T> {
    //* Store the body for debugging purposes
    const body = options.body

    //* Constructs default request options
    options = {
      method: options.body ? 'POST' : 'GET',
      ...options,
      body:
        typeof options.body === 'string'
          ? options.body
          : options.body && JSON.stringify(options.body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options?.headers
      }
    }

    //* Tests if the request is to an external website, and if not then it adds the Authorization header if the user is authenticated
    if (!/^(.+):\/\//.test(url)) {
      const user = auth.currentUser
      const token = user && (await user.getIdToken())
      if (token) {
        if (!options.headers) options.headers = {}
        options.headers['Authorization'] = `Bearer ${token}`
      }
    }

    debug(`REQ ${options.method}: ${url}`, body)

    //* Store response and data externally for debugging purposes
    let res, data
    try {
      //* Send request using fetch api
      res = await fetch(url, options)

      //* if the response is 204 (NO CONTENT) or 405 (METHOD NOT ALLOWED), then return the Allow header as 'data.message'
      if (res.status === 204 || res.status === 405) {
        switch (res.headers.get('Content-Type')) {
          case 'application/json; charset=utf-8':
            data = {
              status: res.status,
              message: res.headers.get('Allow')
            }
            break
          case 'text/plain; charset=utf-8':
          case 'text/html; charset=utf-8':
            data = `Status ${res.status}:\n${Object.entries(res.headers)
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n')}`
            break
          default:
            data = new Blob(
              [
                `Status ${res.status}:\n${Object.entries(res.headers)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n')}`
              ],
              {
                type: 'text/plain'
              }
            )
            break
        }
      } else {
        //* Process the response body based on the response content type
        switch (res.headers.get('Content-Type')) {
          case 'application/json; charset=utf-8':
            data = await res.json()
            if (!data) data = { status: 0, message: 'No Data' }
            break
          case 'text/plain; charset=utf-8':
          case 'text/html; charset=utf-8':
            data = await res.text()
            if (!data) data = 'Status 0:\nNo Data'
            break
          default:
            data = await res.blob()
            if (!data)
              data = new Blob(['Status 0:\nNo Data'], {
                type: 'text/plain'
              })
            break
        }
      }
    } catch (err) {
      data = { status: 1, message: 'HTTP Request Failed' }
    }

    debug(`RES ${options.method}: ${url}`, res, data)

    return data
  }

  /**
   * Sends a get request to a specific url
   * @param url - The url to get data from
   * @param params - The query parameters to send
   * @param headers - The headers to send
   * @returns The response body
   */
  static get<P extends object, T>(
    url: string,
    params?: P,
    headers?: Record<string, string>
  ) {
    url += this.parseParams(params)
    return this.req<T>(url, { headers, method: 'GET' })
  }

  /**
   * Sends a post request to a specific url
   * @param url - The url to post data to
   * @param body - The body to send
   * @param headers - The headers to send
   * @returns The response body
   */
  static post<B, T>(url: string, body?: B, headers?: Record<string, string>) {
    return this.req<T>(url, { body, headers, method: 'POST' })
  }

  /**
   * Sends a put request to a specific url
   * @param url - The url to put data
   * @param body - The body to send
   * @param headers - The headers to send
   * @returns The response body
   */
  static put<B, T>(url: string, body?: B, headers?: Record<string, string>) {
    return this.req<T>(url, { body, headers, method: 'PUT' })
  }

  /**
   * Sends a patch request to a specific url
   * @param url - The url to patch data
   * @param body - The body to send
   * @param headers - The headers to send
   * @returns The response body
   */
  static patch<B, T>(url: string, body?: B, headers?: Record<string, string>) {
    return this.req<T>(url, { body, headers, method: 'PATCH' })
  }

  /**
   * Sends a delete request to a specific url
   * @param url - The url to delete data from
   * @param body - The body to send
   * @param headers - The headers to send
   * @returns The response body
   */
  static delete<B, T>(url: string, body?: B, headers?: Record<string, string>) {
    return this.req<T>(url, { body, headers, method: 'DELETE' })
  }

  /**
   * Sends an options request to a specific url
   * @param url - The url to get options for
   * @param headers - The headers to send
   * @returns The response headers
   */
  static options<T>(url: string, headers?: Record<string, string>) {
    return this.req<T>(url, { headers, method: 'OPTIONS' })
  }

  /**
   * Sends a head request to a specific url
   * @param url - The url to get headers for
   * @param params - The query parameters to send
   * @param headers - The headers to send
   * @returns The response headers
   */
  static head<P extends object, T>(
    url: string,
    params?: P,
    headers?: Record<string, string>
  ) {
    url += this.parseParams(params)
    return this.req<T>(url, { headers, method: 'HEAD' })
  }
}
