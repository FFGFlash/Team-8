import './index.css'
import './firebase'
import { createRoot } from 'react-dom/client'
import { createContext, StrictMode, useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import Loading from './components/Loading'
import useStorage from './hooks/useStorage'
import getRouter from './router'

import Logo from 'client/assets/image/logo.png'
import LogoLight from 'client/assets/image/logo-light.png'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function Root() {
  const [darkMode, setDarkMode] = useStorage('darkMode', true)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const classList = document.documentElement.classList
    classList[darkMode ? 'add' : 'remove']('dark')
    setTimeout(() => classList.remove('preload'), 500)
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(curr => !curr)

  //* Wait for the authentication servers to initialize
  useEffect(
    () =>
      onAuthStateChanged(getAuth(), user => setAuthenticated(user !== null)),
    []
  )

  return (
    <ThemeContext.Provider
      value={{ toggleDarkMode, logo: darkMode ? Logo : LogoLight, darkMode }}
    >
      {authenticated !== null ? (
        <RouterProvider router={getRouter()} fallbackElement={<Loading />} />
      ) : (
        <Loading />
      )}
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
