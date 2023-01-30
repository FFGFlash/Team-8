# API Documentation

## Table of Contents

- [Request Methods](#request-methods)

  - [Current Endpoint Methods](#current-endpoint-methods)

- [API and Error Response](#api-and-error-response)

- [URL Params](#url-params)

- [/rest](#rest)

  - [GET: /rest](#get-rest)

- [/rest/profile](#restprofile)

  - [GET: /rest/profile](#get-restprofile)
  - [POST: /rest/profile](#post-restprofile)
  - [PATCH: /rest/profile](#patch-restprofile)
  - [DELETE: /rest/profile](#delete-restprofile)

- [/rest/profile/:username](#restprofileusername)

  - [GET: /rest/profile/:username](#get-restprofileusername)

# Request Methods

| Methods | Description                                      |               Typical Response Codes               | Content Delivery | Availability |
| ------: | ------------------------------------------------ | :------------------------------------------------: | :--------------: | :----------: |
|     GET | Used to get information (Ready-Only)             |              200 (OK) 404 (NOT FOUND)              |      Query       |      ❔      |
|    POST | Used to create entries/perform actions           |      200 (OK) 201 (CREATED) 400 (BAD REQUEST)      |       JSON       |      ❔      |
|     PUT | Used to update/replace existing entries          |     200 (OK) 204 (NO CONTENT) 404 (NOT FOUND)      |       JSON       |      ❔      |
|   PATCH | Used to update existing entries                  |     200 (OK) 204 (NO CONTENT) 404 (NOT FOUND)      |       JSON       |      ❔      |
|  DELETE | Used to delete existing entries                  | 204 (NO CONTENT) 400 (BAD REQUEST) 404 (NOT FOUND) |       JSON       |      ❔      |
|    HEAD | Used to get the headers of a get request         |                                                    |      Query       |      ✅      |
| OPTIONS | Used to get the available methods of an endpoint |                                                    |       N/A        |      ✅      |

## Current Endpoint Methods

All endpoints require the Accept header, and all non-get/head request require the Content-Type header

```ts
// Non-authenticated get request
fetch('/rest/profile/ffgflash', {
  method: 'GET',
  headers: {
    Accept: 'application/json'
  }
}).then(res => res.json())

// Authenticated post request
fetch('/rest/profile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authentication': 'Bearer <YOUR_AUTH_TOKEN>' // The auth token can be retrieved from firebase
  },
  body: JSON.stringify({
    displayName: 'FFGFlash',
    firstName: 'Drake',
    lastName: 'Taylor'
  })
}).then(res => res.json())
```

| Endpoints               | Authentication | GET | POST | PUT | PATCH | DELETE |
| ----------------------- | :------------: | :-: | :--: | :-: | :---: | :----: |
| /rest/profile           |       ✅       | ✅  |  ✅  |     |  ✅   |   ✅   |
| /rest/profile/:uid      |                | ✅  |      |     |       |        |
| /rest/coffee            |                | ✅  |  ✅  | ✅  |  ✅   |   ✅   |

# API and Error Response

```ts
declare interface ApiResponse {
  message: string
  status: number
  data: object
}

declare interface ErrorResponse extends ApiResponse {
  data?: undefined
}
```

# URL Params

URL parameters allow for information to be apart of the request url,
this allows for more cohesive requests.

URL parameters are denoted with a leading colon,
an example being '/rest/profile/:username' where 'username' is a URL parameter.

# /rest

| Authentication | GET | POST | PUT | PATCH | DELETE |
| :------------: | :-: | :--: | :-: | :---: | :----: |
|                | ✅  |      |     |       |        |

## GET: /rest

Gets the current API version

```ts
declare interface GetRestResponse extends ApiResponse {
  /** {major}.{minor}.{patch} */
  message: `${number}.${number}.${number}`
  status: 200
}
```

# /rest/profile

| Authentication | GET | POST | PUT | PATCH | DELETE |
| :------------: | :-: | :--: | :-: | :---: | :----: |
|       ✅       | ✅  |  ✅  |     |  ✅   |   ✅   |

## GET: /rest/profile

Gets the profile information for the current user.

```ts
declare interface GetProfileResponse extends ApiResponse {
  status: 200
  data: {
    displayName: string
    firstName: string
    lastName: string
  }
}
```

## POST: /rest/profile

Creates a new user profile

```ts
declare interface PostProfileBody {
  displayName: string
  firstName: string
  lastName: string
}

declare interface PostProfileResponse extends ApiResponse {
  status: 201
  data: {
    displayName: string
    firstName: string
    lastName: string
  }
}
```

## PATCH: /rest/profile

Used to update user's profile information

```ts
declare interface PatchProfileBody {
  displayName?: string
  firstName?: string
  lastName?: string
}

declare type PatchProfileResponse = GetProfileResponse
```

## DELETE: /rest/profile

Used to delete the current user

```ts
declare interface DeleteProfileResponse extends ApiResponse {
  status: 200
}
```

# /rest/profile/:username

| Authentication | GET | POST | PUT | PATCH | DELETE |
| :------------: | :-: | :--: | :-: | :---: | :----: |
|                | ✅  |      |     |       |        |

## GET: /rest/profile/:username

Used to get the public profile of a specified user

```ts
declare type GetUserProfileResponse = GetProfileResponse
```
