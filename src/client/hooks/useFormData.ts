import { ChangeEvent, useState } from 'react'

export default function useFormData() {
  const [data, setData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setData(data => ({
      ...data,
      [e.target.name]: e.target.value
    }))
    setErrors(errors => ({
      ...errors,
      [e.target.name]: ''
    }))
  }

  const addError = (error: string, message: string) => {
    setErrors(errors => ({ ...errors, [error]: message }))
    return true as const
  }

  const clearData = (type: 'errors' | 'data' | 'both' = 'both') => {
    if (type === 'data' || type === 'both') setData({})
    if (type === 'errors' || type === 'both') setErrors(() => ({ error: '' }))
  }

  return [data, errors, handleChange, addError, clearData] as const
}
