import { Router } from '@remix-run/router'
import { getAuth } from 'firebase/auth'
import { lazy } from 'react'
import { redirect } from 'react-router-dom'
import { RouteObject, createBrowserRouter } from 'react-router-dom'
import App, { appAction, appLoader } from './App'
import Error from './pages/Error'

const SignIn = lazy(() => import('./pages/SignIn'))
const Home = lazy(() => import('./pages/Home'))
const Metaverse = lazy(() => import('./pages/Metaverse'))
const NFT = lazy(() => import('./pages/NFT'))
const Profile = lazy(() => import('./pages/Profile'))
const Coffee = lazy(() => import('./pages/Coffee'))

function authLoader(shouldBeAuth: boolean, redirectUrl: string) {
  return shouldBeAuth
    ? () => !getAuth().currentUser && redirect(redirectUrl)
    : () => !!getAuth().currentUser && redirect(redirectUrl)
}

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
        loader: authLoader(false, '/profile'),
        element: <SignIn />
      },
      {
        path: '/team-8-land',
        loader: authLoader(true, '/sign-in'),
        element: <Metaverse />
      },
      {
        path: '/nft',
        loader: authLoader(true, '/sign-in'),
        element: <NFT />
      },
      {
        path: '/coffee',
        element: <Coffee />,
        errorElement: <Error />
      },
      {
        path: '/profile',
        loader: authLoader(true, '/sign-in'),
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
