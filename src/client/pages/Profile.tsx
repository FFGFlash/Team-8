import { useRouteLoaderData } from 'react-router-dom'
import { AppLoaderData } from '../App'

export default function Profile() {
  const { user, profile } = useRouteLoaderData('root') as AppLoaderData

  return (
    <div>
      <h1>{profile?.displayName}</h1>
      <p>{user?.email}</p>
    </div>
  )
}
