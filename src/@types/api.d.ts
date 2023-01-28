declare interface ApiResponse {
  message: string
  status: number
  data: any
}

declare interface ErrorResponse extends ApiResponse {
  data?: undefined
}

declare type RequestMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'

//* GET: /rest

declare interface GetRestResponse extends ApiResponse {
  /** {major}.{minor}.{patch} */
  message: `${number}.${number}.${number}`
  status: 200
}
