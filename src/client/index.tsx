import './index.css'
import './firebase'
import { createRoot } from 'react-dom/client'
import { createContext, StrictMode, useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import Loading from './components/Loading'
import useStorage from './hooks/useStorage'

import Logo from 'client/assets/image/logo.png'
import LogoLight from 'client/assets/image/logo-light.png'

function Root() {
  const [darkMode, setDarkMode] = useStorage('darkMode', true)

  useEffect(() => {
    const classList = document.documentElement.classList
    classList[darkMode ? 'add' : 'remove']('dark')
    setTimeout(() => classList.remove('preload'), 500)
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(curr => !curr)

  return (
    <ThemeContext.Provider
      value={{ toggleDarkMode, logo: darkMode ? Logo : LogoLight, darkMode }}
    >
      <RouterProvider router={router} fallbackElement={<Loading />} />
    </ThemeContext.Provider>
  )
}

interface IThemeContext {
  toggleDarkMode: () => void
  logo: string
  darkMode: boolean
}

export const ThemeContext = createContext<IThemeContext>(null!)

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root not found')
else if (!rootElement.innerHTML) {
  const root = createRoot(rootElement)
  root.render(
    <StrictMode>
      <Root />
    </StrictMode>
  )
}
