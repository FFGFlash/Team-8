import { Router } from '@remix-run/router'
import { getAuth } from 'firebase/auth'
import { lazy } from 'react'
import { RouteObject, createBrowserRouter } from 'react-router-dom'
import App, { appAction, appLoader } from './App'
import Error from './pages/Error'

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
    action: appAction,
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
        loader: () => {
          console.log('#', getAuth().currentUser)
          return null
        },
        element: <Profile />,
        errorElement: <Error />,
        children: [
          {
            path: ':uid',
            id: 'profile'
          }
        ]
      }
    ]
  }
]

let router!: Router
export default function getRouter() {
  if (!router) router = createBrowserRouter(routes)
  return router
}
