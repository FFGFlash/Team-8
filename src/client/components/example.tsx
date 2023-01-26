//! JSDoc way

// /**
//  *
//  * @param {*} response
//  * @returns {response is ErrorResponse}
//  */
// function isErrorResponse(response: any) {
//   return response.error !== undefined
// }

// /**
//  * @typedef {Object} ErrorResponse
//  * @property {number} error
//  * @property {string} [err_msg]
//  */

// /**
//  *
//  * @returns {ErrorResponse | {
//  * someData: string
//  * }}
//  */
// function getSomeEndpoint() {
//   return fetch('/some/endpoint').then(res => res.json())
// }

// getSomeEndpoint().then(res => {
// if (isErrorResponse(res)) {
//   console.log(res) // { error: 31 }
//   return
// }
// console.log(res) // { someData: 'some data' }
// })

//! Typescript way

// interface ErrorResponse {
//   error: number
//   err_msg?: string
// }

// function getSomeEndpoint(): Promise<ErrorResponse | { someData: string }> {
//   return fetch('/some/endpoint').then(res => res.json())
// }

// getSomeEndpoint().then(res => {
//   if ('error' in res) {
//     console.log(res)
//     return
//   }
//   console.log(res)
// })
