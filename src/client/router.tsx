import { lazy } from 'react'
import { RouteObject, createBrowserRouter } from 'react-router-dom'
import App from './App'
import Error from './pages/Error'

const Home = lazy(() => import('./pages/Home'))

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  }
]

const router = createBrowserRouter(routes)
export default router
