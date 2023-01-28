import Request from './request'

const PublicProfileApi = {
  get(username: string) {
    return Request.get<never, GetUserProfileResponse | ErrorResponse>(
      `/rest/profile/${username}`
    )
  }
}

export default PublicProfileApi

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
