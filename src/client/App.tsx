import { Helmet } from 'react-helmet'
import LazyOutlet from './components/LazyOutlet'
import tw, { css, styled } from 'twin.macro'

import Icon16x16 from 'client/assets/image/favicon-16x16.png'
import Icon32x32 from 'client/assets/image/favicon-32x32.png'
import Icon48x48 from 'client/assets/image/favicon.png'
import Icon180x180 from 'client/assets/image/apple-touch-icon.png'
import Icon192x192 from 'client/assets/image/192x192.png'
import Icon512x512 from 'client/assets/image/512x512.png'
import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from '.'
import { Link, useLocation } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

export default function App() {
  const { toggleDarkMode, logo } = useContext(ThemeContext)
  const location = useLocation()

  const [navVisible, setNavVisible] = useState(false)

  const toggleNav = () => setNavVisible(curr => !curr)

  // TODO: Add a button to toggle the nav for mobile devices
  const w = window as never as { toggleNav: typeof toggleNav }
  w.toggleNav = toggleNav

  useEffect(() => {
    setNavVisible(false)
  }, [location])

  return (
    <>
      <Helmet>
        <meta charSet='UTF-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
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
      <AppWrapper>
        <NavButton onClick={toggleNav}>O</NavButton>
        <BodyWrapper>
          <Nav visible={navVisible}>
            <NavList>
              {/* TODO: Get a close svg */}
              <NavButton onClick={toggleNav}>X</NavButton>
              <LogoItem>
                <img src={logo} />
              </LogoItem>
              <li>
                <NavLink to='/'>Home</NavLink>
              </li>
              <li>
                <NavLink to='/coffee'>Coffee</NavLink>
              </li>
            </NavList>
            <NavList>
              <li>Second List</li>
            </NavList>
            <NavList>
              <li>Third List</li>
            </NavList>
          </Nav>
          <PageWrapper>
            <LazyOutlet />
          </PageWrapper>
        </BodyWrapper>
        <Footer>
          <div>
            <button onClick={toggleDarkMode} tw='block'>
              <StyledFooterLogo src={logo} />
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
          <div>
            <p>
              <CopyrightText>Copyright</CopyrightText> &#169; 2023 Team-8
            </p>
          </div>
        </Footer>
      </AppWrapper>
    </>
  )
}

const AppWrapper = tw.div`flex flex-col min-h-full`
const BodyWrapper = tw.div`flex flex-1`
const PageWrapper = tw.div`flex flex-1`

const Nav = styled.nav(({ visible }: { visible?: boolean }) => [
  tw`flex text-center fixed inset-0 w-full flex-col divide-y divide-neutral-400 dark:divide-neutral-500 bg-neutral-200 dark:bg-neutral-900 px-8 py-4 lg:opacity-100 lg:w-60 lg:text-left lg:relative lg:visible! lg:animate-none`,
  visible ? tw`animate-slide-in` : tw`animate-slide-out`,
  css`
    html.preload & {
      visibility: hidden;
    }
  `
])
const NavButton = tw.button`lg:hidden absolute top-2 right-4`
const NavList = tw.ul`py-5 first:pt-0 first:border-none last:pb-0`
const LogoItem = tw.li`flex justify-center`

const Footer = tw.div`flex justify-between items-center px-8 py-4 bg-neutral-200 dark:bg-neutral-900`
const StyledFooterLogo = tw.img`h-9`
const CopyrightText = tw.span`hidden sm:inline`
const FooterNav = tw.ul`hidden flex-row gap-5 items-center justify-center md:flex`
const FooterNavItem = tw.li`text-sm`
