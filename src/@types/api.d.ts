interface ApiResponse {
  message: string
  status: number
  data: any
}

//* GET: /rest/profile

interface GetProfileResponse extends ApiResponse {
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

type PostProfileBody =
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

interface PostProfileSignUpResponse extends ApiResponse {
  status: 201
}

type PostProfileSignInResponse = GetProfileResponse

//* PUT: /rest/profile

interface PutProfileBody {
  username?: string
  email?: string
  newPassword?: string
  password: string
}

type PutProfileResponse = GetProfileResponse

//* PATCH: /rest/profile

interface PatchProfileBody {
  firstName?: string
  lastName?: string
}

type PatchProfileResponse = GetProfileResponse

//* DELETE: /rest/profile

interface DeleteProfileBody {
  password: string
}

interface DeleteProfileResponse extends ApiResponse {
  status: 200
}

//* GET: /rest/profile/:username

interface GetUserProfileResponse extends ApiResponse {
  status: 200
  data: {
    username: string
    firstName: string
    lastName: string
    password: string
  }
}
