import tw, { styled } from 'twin.macro'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import Wrapper from '../components/styled/Wrapper.styled'
import useFormData from '../hooks/useFormData'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth'
import ProfileAPI from '../api/profile'
import { useNavigate } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'

const auth = getAuth()

const firebaseErrors: Record<string, string> = {
  'auth/email-already-exists':
    'Looks like we already have a user with that email address.',
  'auth/internal-error':
    "Looks like we're having trouble with our authentication servers, please try again.",
  'auth/user-not-found':
    "We couldn't find a user with those credentials, please try again."
}

export default function SignIn() {
  const [createAccount, setCreateAccount] = useState(false)
  const toggleCreateAccount = () => setCreateAccount(curr => !curr)
  const navigate = useNavigate()

  const [data, errors, handleChange, addError, clearData] = useFormData()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearData('errors')
    let error = false
    if (createAccount) {
      //* Check if information is valid
      if (!data.email) error = addError('email', 'required')
      if (!data.password) error = addError('password', 'required')
      if (!data.passwordConfirmation)
        error = addError('passwordConfirmation', 'required')
      if (!data.displayName) error = addError('displayName', 'required')
      if (!data.firstName) error = addError('firstName', 'required')
      if (!data.lastName) error = addError('lastName', 'required')
      if (
        data.password &&
        data.passwordConfirmation &&
        data.password !== data.passwordConfirmation
      )
        error = addError('passwordConfirmation', 'must match password')
      if (error) return
      //* If the information is valid create a new user
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(() => {
          //* Once the user is created tell our server to create their profile
          ProfileAPI.post({
            displayName: data.displayName,
            firstName: data.firstName,
            lastName: data.lastName
          })
            .then(() => {
              navigate('/profile')
            })
            .catch(error => {
              console.error(error)
              addError(
                'error',
                'Unknown error occurred while creating profile.'
              )
            })
        })
        .catch((error: FirebaseError) => {
          console.error(error.code)
          addError('error', firebaseErrors[error.code] || error.message)
        })
    } else {
      if (!data.email) error = addError('email', 'required')
      if (!data.password) error = addError('password', 'required')
      if (error) return
      signInWithEmailAndPassword(auth, data.email, data.password)
        .then(async () => {
          navigate('/profile')
        })
        .catch((error: FirebaseError) => {
          console.error(error.code)
          addError('error', firebaseErrors[error.code] || error.message)
        })
    }
  }

  useEffect(() => {
    clearData()
  }, [createAccount])

  const w = window as never as { errors: typeof errors }
  w.errors = errors

  return (
    <Wrapper>
      <SignInWrapper>
        <Box>
          <h2>{createAccount ? 'Create an Account' : 'Sign In'}</h2>
          <StyledForm onSubmit={handleSubmit}>
            {errors.error && (
              <ErrorSpan align='center'>{errors.error}</ErrorSpan>
            )}
            {createAccount ? (
              <>
                <InputFieldWrapper>
                  <Input
                    label='Full Name'
                    name='firstName'
                    type='text'
                    placeholder='First name'
                    value={data.firstName || ''}
                    onChange={handleChange}
                    error={errors.firstName}
                  />
                  <Input
                    name='lastName'
                    type='text'
                    placeholder='Last name'
                    value={data.lastName || ''}
                    onChange={handleChange}
                    error={errors.lastName}
                  />
                </InputFieldWrapper>
                <Input
                  label='Display Name'
                  name='displayName'
                  type='text'
                  placeholder='Display Name'
                  value={data.displayName || ''}
                  onChange={handleChange}
                  error={errors.displayName}
                />
                <Input
                  label='Email'
                  name='email'
                  type='email'
                  placeholder='Email'
                  value={data.email || ''}
                  onChange={handleChange}
                  error={errors.email}
                />
                <Input
                  label='Password'
                  name='password'
                  type='password'
                  placeholder='Password'
                  value={data.password || ''}
                  onChange={handleChange}
                  error={errors.password}
                />
                <Input
                  label='Confirm Password'
                  name='passwordConfirmation'
                  type='password'
                  placeholder='Confirm Password'
                  value={data.passwordConfirmation || ''}
                  onChange={handleChange}
                  error={errors.passwordConfirmation}
                />
              </>
            ) : (
              <>
                <Input
                  label='Email'
                  name='email'
                  type='text'
                  placeholder='Email'
                  value={data.email || ''}
                  onChange={handleChange}
                  error={errors.email}
                />
                <Input
                  label='Password'
                  name='password'
                  type='password'
                  placeholder='Password'
                  value={data.password || ''}
                  onChange={handleChange}
                  error={errors.password}
                />
              </>
            )}
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
const Box = tw.div`w-full h-full p-16 flex flex-col justify-around items-center gap-4 bg-neutral-200 dark:bg-neutral-900 sm:(shadow rounded-[8rem] mb-14) md:(w-[64rem] h-[64rem])`
const StyledForm = tw.form`grid grid-cols-1 items-center gap-4 w-full md:px-32`
const InputFieldWrapper = tw.div`flex justify-between gap-4`
const SignInButton = tw.button`text-neutral-100 bg-red-500 rounded-xl w-60 py-2 justify-self-center`
const CreateAccountButton = tw.button`border-none underline text-red-500`

interface InputProps {
  name: string
  type?: 'text' | 'email' | 'number' | 'password'
  placeholder?: string
  label?: string
  value?: any
  error?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export function Input({
  name,
  type,
  placeholder,
  label,
  value,
  error,
  onChange
}: InputProps) {
  return (
    <InputWrapper>
      <LabelWrapper>
        {label && <InputLabel>{label}</InputLabel>}
        {error && <ErrorSpan>{error}</ErrorSpan>}
      </LabelWrapper>
      <StyledInput
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        error={error}
      />
    </InputWrapper>
  )
}

const InputWrapper = tw.div`flex flex-col justify-end w-full`
const LabelWrapper = tw.div`flex`
const InputLabel = tw.label`text-sm text-neutral-900 dark:text-neutral-100`
const ErrorSpan = styled.span<{ align?: 'center' | 'left' | 'right' }>(
  ({ align }) => [
    tw`text-sm text-red-400 flex-1`,
    align === 'center'
      ? tw`text-center`
      : align === 'left'
      ? tw`text-left`
      : tw`text-right`
  ]
)
const StyledInput = styled.input<{ error?: string }>(({ error }) => [
  tw`rounded-xl pl-2 py-1.5 w-full text-neutral-900 text-left outline-none placeholder:text-neutral-700`,
  error && error !== '' ? tw`bg-red-400` : tw`bg-neutral-100!`
])
