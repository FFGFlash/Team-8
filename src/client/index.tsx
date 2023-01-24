import './index.css'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import Loading from './components/Loading'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root not found')
else if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)

  root.render(
    <StrictMode>
      <RouterProvider router={router} fallbackElement={<Loading />} />
    </StrictMode>
  )
}
