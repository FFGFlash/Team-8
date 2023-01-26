import tw from 'twin.macro'
import { useState } from 'react'
import { Form } from 'react-router-dom'
import Wrapper from '../components/styled/Wrapper.styled'

export default function SignIn() {
  const [createAccount, setCreateAccount] = useState(false)
  const toggleCreateAccount = () => setCreateAccount(curr => !curr)

  return (
    <Wrapper>
      <SignInWrapper>
        <Box>
          <h1>{createAccount ? 'Create an Account' : 'Sign In'}</h1>
          <StyledForm action='/profile' method={createAccount ? 'put' : 'post'}>
            {createAccount ? (
              <>
                <Input name='username' type='text' placeholder='Username' />
                <Input name='email' type='email' placeholder='Email' />
              </>
            ) : (
              <Input name='email' type='email' placeholder='Username / Email' />
            )}
            <Input name='password' type='password' placeholder='Password' />
            <SignInButton>
              {createAccount ? 'Create Account' : 'Sign In'}
            </SignInButton>
          </StyledForm>
          <CreateAccountButton onClick={toggleCreateAccount}>
            {createAccount ? 'Sign In?' : 'Create an Account'}
          </CreateAccountButton>
        </Box>
      </SignInWrapper>
    </Wrapper>
  )
}

const SignInWrapper = tw.div`w-full h-full flex justify-center items-center`
const Box = tw.div`p-16 flex flex-col justify-around items-center gap-4 shadow rounded-[8rem] mb-14 md:w-[64rem] md:h-[64rem] bg-neutral-200 dark:bg-neutral-900`
const StyledForm = tw(Form)`flex flex-col items-center gap-8 mb-8`
const Input = tw.input`rounded-xl pl-2 py-1.5 w-96 text-black text-center outline-none`
const SignInButton = tw.button`text-white bg-red-500 rounded-xl w-60 py-2`
const CreateAccountButton = tw.button`border-none underline text-red-500`
