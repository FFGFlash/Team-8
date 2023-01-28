declare interface ApiResponse {
  message: string
  status: number
  data?: any
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

//* GET: /rest/profile/:username

declare interface GetUserProfileResponse extends ApiResponse {
  status: 200
  data: {
    username: string
    firstName: string
    lastName: string
    password: string
  }
}
