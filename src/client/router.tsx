import { lazy } from 'react'
import { RouteObject, createBrowserRouter } from 'react-router-dom'
import App, { appLoader } from './App'
import Error from './pages/Error'
import profileLoader from './features/profile/loader'
import profileAction from './features/profile/action'

const SignIn = lazy(() => import('./pages/SignIn'))
const Home = lazy(() => import('./pages/Home'))
const Metaverse = lazy(() => import('./pages/Metaverse'))
const NFT = lazy(() => import('./pages/NFT'))
const Profile = lazy(() => import('./pages/Profile'))
const Coffee = lazy(() => import('./pages/Coffee'))

const routes: RouteObject[] = [
  {
    path: '/',
    id: 'root',
    element: <App />,
    loader: appLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/sign-in',
        element: <SignIn />
      },
      {
        path: '/team-8-land',
        element: <Metaverse />
      },
      {
        path: '/nft',
        element: <NFT />
      },
      {
        path: '/coffee',
        element: <Coffee />,
        errorElement: <Error />
      },
      {
        path: '/profile',
        action: profileAction,
        element: <Profile />,
        errorElement: <Error />,
        children: [
          {
            path: ':username',
            id: 'profile',
            loader: profileLoader
          }
        ]
      }
    ]
  }
]

const router = createBrowserRouter(routes)
export default router
