import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export default function useStorage<T>(
  name: string,
  value: T
): [T, Dispatch<SetStateAction<T>>] {
  const type = typeof value

  const [state, setState] = useState(value)

  useEffect(() => {
    let loadedValue: any = localStorage.getItem(name)

    if (loadedValue) {
      switch (type) {
        case 'bigint':
        case 'number':
          loadedValue = parseInt(loadedValue)
          break
        case 'boolean':
          loadedValue = loadedValue === 'true'
          break
        case 'object':
          loadedValue = JSON.parse(loadedValue)
          break
        default:
          break
      }
      setState(loadedValue as T)
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(
      () => localStorage.setItem(name, JSON.stringify(state)),
      100
    )
    return () => clearTimeout(timeout)
  }, [state])

  return [state, setState]
}
