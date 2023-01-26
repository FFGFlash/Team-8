import { useRouteError, NavLink } from 'react-router-dom'
import tw from 'twin.macro'

interface ErrorProps {
  status?: number
  message?: string
}

export default function Error({ status, message }: ErrorProps) {
  const error = useRouteError() as {
    status: number
    statusText?: string
    message?: string
  }

  return (
    <ErrorWrapper>
      <ErrorContainer>
        <span>Error {status || error.status}: </span>
        <span>{message || error.statusText || error.message}</span>
        <Link to='/'>go back home</Link>
      </ErrorContainer>
    </ErrorWrapper>
  )
}

const ErrorWrapper = tw.div`px-4 w-full h-full flex items-center`
const ErrorContainer = tw.div`mx-auto px-10 py-5 rounded-md bg-neutral-100 
dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-red-400 
dark:border-red-500 border-2 shadow-lg 
gap-3 text-center`
const Link = tw(NavLink)`block underline hover:scale-102`
