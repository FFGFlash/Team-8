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

/**
 * If the user is authenticated go to it's element, otherwise,
 * redirects to the provided URL
 * @param redirectUrl - The url to redirect too
 * @param shouldBeAuth - Whether the user should be authenticated or not
 * @returns Loader function to use for a page
 */
const authLoader =
  (redirectUrl: string, shouldBeAuth = true) =>
  () =>
    !getAuth().currentUser === shouldBeAuth && redirect(redirectUrl)

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
        loader: authLoader('/profile', false),
        element: <SignIn />
      },
      {
        path: '/team-8-land',
        loader: authLoader('/sign-in'),
        element: <Metaverse />
      },
      {
        path: '/nft',
        loader: authLoader('/sign-in'),
        element: <NFT />
      },
      {
        path: '/coffee',
        element: <Coffee />,
        errorElement: <Error />
      },
      {
        path: '/profile',
        loader: authLoader('/sign-in'),
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
