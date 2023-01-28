export type ParamResolvable = string | number | boolean

export interface RequestParams {
  [key: string]: ParamResolvable | ParamResolvable[]
}

export interface RequestOptions extends RequestInit {
  method?: RequestMethod
  body?: any
}

function debug(message: any, ...args: any[]) {
  // eslint-disable-next-line no-console
  return process.env.NODE_ENV === 'development' && console.log(message, ...args)
}

export default class Request<
  GetParams extends RequestParams,
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

  static parseParams(params?: RequestParams) {
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

  static async req<T>(url: string, options: RequestOptions = {}): Promise<T> {
    options = {
      method: options.body ? 'POST' : 'GET',
      ...options,
      body:
        typeof options.body === 'string'
          ? options.body
          : options.body && JSON.stringify(options.body),
      headers: {
        Accept: 'application/json',
        ...options?.headers
      }
    }

    debug(`REQ ${options.method}: ${url}`, options.body)

    let res, data
    try {
      res = await fetch(url, options)

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

  static get<P extends RequestParams, T>(
    url: string,
    params?: P,
    headers?: HeadersInit
  ) {
    url += this.parseParams(params)
    return this.req<T>(url, { headers, method: 'GET' })
  }

  static post<B, T>(url: string, body?: B, headers?: HeadersInit) {
    return this.req<T>(url, { body, headers, method: 'POST' })
  }

  static put<B, T>(url: string, body?: B, headers?: HeadersInit) {
    return this.req<T>(url, { body, headers, method: 'PUT' })
  }

  static patch<B, T>(url: string, body?: B, headers?: HeadersInit) {
    return this.req<T>(url, { body, headers, method: 'PATCH' })
  }

  static delete<B, T>(url: string, body?: B, headers?: HeadersInit) {
    return this.req<T>(url, { body, headers, method: 'DELETE' })
  }

  static options<T>(url: string, headers?: HeadersInit) {
    return this.req<T>(url, { headers, method: 'OPTIONS' })
  }

  static head<P extends RequestParams, T>(
    url: string,
    params?: P,
    headers?: HeadersInit
  ) {
    url += this.parseParams(params)
    return this.req<T>(url, { headers, method: 'HEAD' })
  }
}
