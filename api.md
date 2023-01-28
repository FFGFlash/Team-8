# API Documentation

## Table of Contents

- [API Documentation](#api-documentation)
  - [Table of Contents](#table-of-contents)
- [Request Methods](#request-methods)
  - [Current Endpoint Methods](#current-endpoint-methods)
- [API Response](#api-response)
- [URL Params](#url-params)
- [/rest/profile](#restprofile)
  - [GET: /rest/profile](#get-restprofile)
  - [POST: /rest/profile](#post-restprofile)
  - [PUT: /rest/profile](#put-restprofile)
  - [PATCH: /rest/profile](#patch-restprofile)
  - [DELETE: /rest/profile](#delete-restprofile)
- [/rest/profile/:username](#restprofileusername)
  - [GET: /rest/profile/:username](#get-restprofileusername)

# Request Methods

| Methods | Description                              | Typical Response Codes                             | Content Delivery |
| ------- | ---------------------------------------- | -------------------------------------------------- | ---------------- |
| GET     | Used to get information (Ready-Only)     | 200 (OK) 404 (NOT FOUND)                           | Query Parameters |
| POST    | Used to create entries/perform actions   | 200 (OK) 201 (CREATED) 400 (BAD REQUEST)           | JSON Body        |
| PUT     | Used to update/replace existing entries  | 200 (OK) 204 (NO CONTENT) 404 (NOT FOUND)          | JSON Body        |
| PATCH   | Used to update existing entries          | 200 (OK) 204 (NO CONTENT) 404 (NOT FOUND)          | JSON Body        |
| DELETE  | Used to delete existing entries          | 204 (NO CONTENT) 400 (BAD REQUEST) 404 (NOT FOUND) | JSON Body        |
| HEAD    | Used to get the headers of a get request |                                                    | Query Parameters |

## Current Endpoint Methods

| Endpoints               | GET | POST | PUT | PATCH | DELETE |
| ----------------------- | --- | ---- | --- | ----- | ------ |
| /rest/profile           | ✅  | ✅   | ✅  | ✅    | ✅     |
| /rest/profile/:username | ✅  |      |     |       |        |
| /rest/coffee            | ✅  | ✅   | ✅  | ✅    | ✅     |

# API Response

```ts
interface ApiResponse {
  message: string
  status: number
  data: any
}
```

# URL Params

URL parameters allow for information to be apart of the request url,
this allows for more cohesive requests.

URL parameters are denoted with a leading colon,
an example being '/rest/profile/:username' where 'username' is a URL parameter.

# /rest/profile

## GET: /rest/profile

Gets the profile information for the current user.

```ts
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
```

## POST: /rest/profile

Creates a new user or sign in to an existing one.

```ts
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
```

## PUT: /rest/profile

Used to update user's critical information

```ts
interface PutProfileBody {
  username?: string
  email?: string
  newPassword?: string
  password: string
}

type PutProfileResponse = GetProfileResponse
```

## PATCH: /rest/profile

Used to update user's non-critical information

```ts
interface PatchProfileBody {
  firstName?: string
  lastName?: string
}

type PatchProfileResponse = GetProfileResponse
```

## DELETE: /rest/profile

Used to delete the current user

```ts
interface DeleteProfileBody {
  password: string
}

interface DeleteProfileResponse extends ApiResponse {
  status: 200
}
```

# /rest/profile/:username

## GET: /rest/profile/:username

Used to get the public profile of a specified user

```ts
interface GetUserProfileResponse extends ApiResponse {
  status: 200
  data: {
    username: string
    firstName: string
    lastName: string
    password: string
  }
}
```