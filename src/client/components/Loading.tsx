import tw from 'twin.macro'
import Spinner from 'client/assets/svg/spinner.svg'

export default function Loading() {
  return (
    <LoadingWrapper>
      <SpinnerIcon />
    </LoadingWrapper>
  )
}

const LoadingWrapper = tw.div`flex justify-center items-center w-full h-full`
const SpinnerIcon = tw(
  Spinner
)`animate-loading w-20 h-20 stroke-blue-500 inline`
