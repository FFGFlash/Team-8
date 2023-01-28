import Request from './request'

const PublicProfileApi = {
  get(username: string) {
    return Request.get<never, GetUserProfileResponse | ErrorResponse>(
      `/rest/profile/${username}`
    )
  }
}

export default PublicProfileApi
