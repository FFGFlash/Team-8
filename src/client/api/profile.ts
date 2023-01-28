import Request from './request'

const ProfileAPI = new Request<
  never,
  GetProfileResponse,
  PostProfileBody,
  PostProfileSignUpResponse | PostProfileSignInResponse,
  PatchProfileBody,
  PatchProfileResponse,
  PutProfileBody,
  PutProfileResponse,
  DeleteProfileBody,
  DeleteProfileResponse
>('/rest/profile')

export default ProfileAPI

//* GET: /rest/profile
export interface GetProfileResponse extends ApiResponse {
  status: 200
  data: {
    username: string
    email: string
    firstName: string
    lastName: string
    password: string
  }
}

//* POST: /rest/profile
export type PostProfileBody =
  | {
      method: 'sign-up'
      email: string
      username: string
      password: string
      firstName: string
      lastName: string
    }
  | {
      method: 'sign-in'
      emailOrUsername: string
      password: string
    }

export interface PostProfileSignUpResponse extends ApiResponse {
  status: 201
}

export type PostProfileSignInResponse = GetProfileResponse

//* PUT: /rest/profile
export interface PutProfileBody {
  username?: string
  email?: string
  newPassword?: string
  password: string
}

export type PutProfileResponse = GetProfileResponse

//* PATCH: /rest/profile
export interface PatchProfileBody {
  firstName?: string
  lastName?: string
}

export type PatchProfileResponse = GetProfileResponse

//* DELETE: /rest/profile
export interface DeleteProfileBody {
  password: string
}

export interface DeleteProfileResponse extends ApiResponse {
  status: 200
}
