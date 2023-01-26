import { LoaderFunctionArgs } from 'react-router-dom'

export interface ProfileLoaderData {
  username: string
  email: string
}

export default function profileLoader({
  params: { username }
}: LoaderFunctionArgs) {
  // TODO: Load user profile
  return { username, email: `${username}@timtam.com` }
}
