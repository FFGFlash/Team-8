import { useRouteLoaderData } from 'react-router-dom'
import { AppLoaderData } from '../App'
import { ProfileLoaderData } from '../features/profile/loader'

export default function Profile() {
  const { user } = useRouteLoaderData('root') as AppLoaderData
  const profile = useRouteLoaderData('profile') as ProfileLoaderData
  const displayUser = profile || user

  return (
    <div>
      <h1>{displayUser.username}</h1>
      <p>{displayUser.email}</p>
    </div>
  )
}
