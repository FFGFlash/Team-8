import { ActionFunctionArgs } from 'react-router-dom'

export default async function profileAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  switch (request.method) {
    case 'POST':
      // TODO: Sign In
      break
    case 'PUT':
      // TODO: Create Account
      break
    case 'DELETE':
      // TODO: Delete Account
      break
    case 'PATCH':
      // TODO: Update Account
      break
    default:
      throw new Error('Invalid request method')
  }
}
