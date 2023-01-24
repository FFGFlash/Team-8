import { lazy } from 'react'
import { RouteObject, createBrowserRouter } from 'react-router-dom'
import App from './App'
import Error from './pages/Error'

const Home = lazy(() => import('./pages/Home'))
const Coffee = lazy(() => import('./pages/Coffee'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/coffee',
        element: <Coffee />,
        errorElement: <Error />
      }
    ]
  }
]

const router = createBrowserRouter(routes)
export default router
