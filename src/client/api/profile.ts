import Request from './request'

const ProfileAPI = new Request<
  never,
  GetProfileResponse,
  PostProfileBody,
  PostProfileResponse,
  PatchProfileBody,
  PatchProfileResponse,
  never,
  never,
  never,
  DeleteProfileResponse
>('/rest/profile')

export default ProfileAPI

//* GET: /rest/profile
export interface GetProfileResponse extends ApiResponse {
  status: 200
  data: {
    firstName: string
    lastName: string
    displayName: string
  }
}

//* POST: /rest/profile
export interface PostProfileBody {
  firstName: string
  lastName: string
  displayName: string
}

export interface PostProfileResponse extends ApiResponse {
  status: 201
  data: {
    firstName: string
    lastName: string
    displayName: string
  }
}

export type PutProfileResponse = GetProfileResponse

//* PATCH: /rest/profile
export interface PatchProfileBody {
  firstName?: string
  lastName?: string
  displayName?: string
}

export type PatchProfileResponse = GetProfileResponse

//* DELETE: /rest/profile
export interface DeleteProfileResponse extends ApiResponse {
  status: 200
}
