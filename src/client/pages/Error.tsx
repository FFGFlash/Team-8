import { useRouteError } from 'react-router-dom'
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
        Error {status || error.status}:{' '}
        {message || error.statusText || error.message}
      </ErrorContainer>
    </ErrorWrapper>
  )
}

const ErrorWrapper = tw.div`h-full flex items-center`
const ErrorContainer = tw.div`mx-auto px-10 py-5 rounded-md bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-red-400 dark:border-red-500 border-2 shadow-lg`
