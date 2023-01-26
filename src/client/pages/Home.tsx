import tw from 'twin.macro'
import { useState } from 'react'
import Wrapper from '../components/styled/Wrapper.styled'
import Freestyle from '../features/home/Freestyle'

export default function Home() {
  const [freestyleActive, setFreestyleActive] = useState(false)

  return (
    <Wrapper>
      <SomeDiv>
        <h2>New Album Out Now!</h2>
        <button onClick={() => setFreestyleActive(curr => !curr)}>
          {freestyleActive ? 'Close' : 'Play'}
        </button>
      </SomeDiv>
      {freestyleActive && (
        <FreestyleOverlay>
          <Freestyle />
        </FreestyleOverlay>
      )}
    </Wrapper>
  )
}

const SomeDiv = tw.div`text-center`
const FreestyleOverlay = tw.div`absolute bottom-0 right-0 z-50`
