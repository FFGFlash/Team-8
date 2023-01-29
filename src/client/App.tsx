import { Helmet } from 'react-helmet'
import LazyOutlet from './components/LazyOutlet'
import tw, { css, styled } from 'twin.macro'
import Hamburger from 'client/assets/svg/hamburger.svg'
import SunIcon from 'client/assets/svg/sun.svg'
import MoonIcon from 'client/assets/svg/moon.svg'

import Icon16x16 from 'client/assets/image/favicon-16x16.png'
import Icon32x32 from 'client/assets/image/favicon-32x32.png'
import Icon48x48 from 'client/assets/image/favicon.png'
import Icon180x180 from 'client/assets/image/apple-touch-icon.png'
import Icon192x192 from 'client/assets/image/192x192.png'
import Icon512x512 from 'client/assets/image/512x512.png'
import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '.'
import {
  Link,
  redirect,
  useLocation,
  ActionFunctionArgs,
  useRevalidator
} from 'react-router-dom'
import { NavLink, useLoaderData, useSubmit } from 'react-router-dom'
import { getAuth, User, signOut, onAuthStateChanged } from 'firebase/auth'
import ProfileAPI from './api/profile'
// import addEventListener from './utils/addEventListener'

const auth = getAuth()

export default function App() {
  const [navVisible, setNavVisible] = useState(false)
  const { revalidate } = useRevalidator()

  const toggleNav = () => setNavVisible(curr => !curr)

  // TODO: Add a button to toggle the nav for mobile devices
  const w = window as never as { toggleNav: typeof toggleNav }
  w.toggleNav = toggleNav

  //* Close Side Nav on Location Change
  const location = useLocation()
  useEffect(() => {
    setNavVisible(false)
  }, [location])

  //* Revalidate loaders when the authentication state changes
  useEffect(() => onAuthStateChanged(auth, () => revalidate()), [])

  return (
    <>
      <Head />
      <AppWrapper>
        <NavButton onClick={toggleNav}>
          <HamburgerToggle />
        </NavButton>
        <BodyWrapper>
          <SideNav toggleNav={toggleNav} navVisible={navVisible} />
          <PageWrapper>
            <LazyOutlet />
          </PageWrapper>
        </BodyWrapper>
        <Footer />
      </AppWrapper>
    </>
  )
}

const AppWrapper = tw.div`flex flex-col min-h-full`
const BodyWrapper = tw.div`flex flex-1`
const PageWrapper = tw.div`flex flex-1`
const HamburgerToggle = tw(
  Hamburger
)`w-12 h-12 text-neutral-900 dark:text-white`

function Head() {
  //TODO Make this more Adaptive
  //! Doesn't look good on Pixel, might need to find an alternative method
  //* This creates a CSS var used for fitting the app inside the browser gui instead of behind it
  // useEffect(() => {
  //   let timeout: any
  //   function waitForRoot() {
  //     const root = document.getElementById('root')
  //     if (root) root.style.height = '90vh'
  //     else timeout = setTimeout(waitForRoot, 100)
  //   }

  //   isMobileDevice() && waitForRoot()

  //   return () => timeout && clearTimeout(timeout)
  // }, [])

  return (
    <Helmet>
      <meta charSet='UTF-8' />
      <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
      <meta
        name='viewport'
        content='width=device-width, height=device-height, initial-scale=1.0'
      />
      <meta name='msapplication-TileColor' content='#D83434' />
      <meta name='msapplication-TileImage' content={Icon192x192} />
      <link rel='apple-touch-icon-precomposed' href={Icon180x180} />
      <link rel='icon' sizes='16x16' href={Icon16x16} />
      <link rel='icon' sizes='32x32' href={Icon32x32} />
      <link rel='icon' sizes='48x48' href={Icon48x48} />
      <link rel='icon' sizes='180x180' href={Icon180x180} />
      <link rel='icon' sizes='192x192' href={Icon192x192} />
      <link rel='icon' sizes='512x512' href={Icon512x512} />
      <title>Team 8</title>
    </Helmet>
  )
}

interface SideNavProps {
  navVisible: boolean
  toggleNav: () => void
}

function SideNav({ navVisible, toggleNav }: SideNavProps) {
  const submit = useSubmit()
  const { user, profile } = useLoaderData() as AppLoaderData
  const authenticated = !!user

  const { logo } = useContext(ThemeContext)

  const handleSignOut = () => submit({ action: 'sign-out' }, { method: 'post' })

  return (
    <Nav visible={navVisible}>
      <NavList>
        {/* TODO: Get a close svg */}
        <NavButton onClick={toggleNav}>X</NavButton>
        <LogoItem>
          <NavLink to='/'>
            <img src={logo} />
          </NavLink>
        </LogoItem>
        <ListItem>
          <NavLink to='/'>Home</NavLink>
        </ListItem>
        {authenticated ? (
          <>
            <ListItem>
              <NavLink to='/team-8-land'>Metaverse</NavLink>
            </ListItem>
            <ListItem>
              <NavLink to='/nft'>NFT</NavLink>
            </ListItem>
          </>
        ) : (
          <ListItem>
            <NavLink to='/sign-in'>Sign In</NavLink>
          </ListItem>
        )}
      </NavList>
      {authenticated && (
        <>
          <NavList>
            <ListItem>{'{GROUPS}'}</ListItem>
            <ListItem>{'Recent Group'}</ListItem>
            <ListItem>{'Recent Group'}</ListItem>
            <ListItem>{'Recent Group'}</ListItem>
          </NavList>
          <NavList>
            <ListItem>{'{NETWORK}'}</ListItem>
            <ListItem>
              <NavLink to='/profile'>{profile?.displayName}</NavLink>
            </ListItem>
          </NavList>
        </>
      )}
      <NavList>
        {authenticated && (
          <ListItem onClick={handleSignOut} className='cursor-pointer'>
            Sign Out
          </ListItem>
        )}
      </NavList>
    </Nav>
  )
}

const Nav = styled.nav(({ visible }: { visible?: boolean }) => [
  tw`z-10 flex text-center fixed inset-0 w-full flex-col divide-y divide-neutral-400 dark:divide-neutral-500 bg-neutral-200 dark:bg-neutral-900 px-8 py-4 lg:opacity-100 lg:w-72 lg:text-left lg:relative lg:visible! lg:animate-none`,
  visible ? tw`animate-slide-in` : tw`animate-slide-out`,
  css`
    html.preload & {
      visibility: hidden;
    }
  `
])
const NavButton = tw.button`lg:hidden absolute top-2 right-4 z-10`
const NavList = tw.ul`py-5 first:pt-0 first:border-none last:pb-0`
const ListItem = tw.li`my-4`
const LogoItem = tw.li`flex justify-center`

function Footer() {
  const { toggleDarkMode, darkMode } = useContext(ThemeContext)

  return (
    <FooterWrapper>
      <div>
        <button onClick={toggleDarkMode} tw='block'>
          {darkMode ? <StyledSunIcon /> : <StyledMoonIcon />}
        </button>
      </div>
      <FooterNav>
        <FooterNavItem>
          <Link to='/'>Home</Link>
        </FooterNavItem>
        <FooterNavItem>
          <Link to='/coffee'>Coffee</Link>
        </FooterNavItem>
      </FooterNav>
      <div className='flex items-center gap-3'>
        <span>&#169; 2023 - </span>
        <InfinityText>&infin;</InfinityText>
        <span> Team 8</span>
      </div>
    </FooterWrapper>
  )
}

const FooterWrapper = tw.div`flex justify-between items-center px-8 py-4 bg-neutral-200 dark:bg-neutral-900`
const FooterNav = tw.ul`hidden flex-row gap-5 items-center justify-center md:flex`
const FooterNavItem = tw.li`text-sm`
const InfinityText = tw.span`text-xl font-light -translate-y-[3px]`
const StyledSunIcon = tw(SunIcon)`h-10`
const StyledMoonIcon = tw(MoonIcon)`h-10`

export interface AppLoaderData {
  user: User | null
  profile:
    | {
        displayName: string
        firstName: string
        lastName: string
      }
    | undefined
}

export async function appLoader(): Promise<AppLoaderData> {
  const user = getAuth().currentUser
  const profile = user && (await ProfileAPI.get())

  return {
    user,
    profile: profile?.data
  }
}

export async function appAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const action = formData.get('action')

  switch (action) {
    case 'sign-out':
      await signOut(auth)
      return redirect('/')
    default:
      throw new Error('Unknown action')
  }
}
