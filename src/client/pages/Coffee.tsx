import { useState } from 'react'
import CoffeeAPI from '../api/coffee'
import Error from './Error'

const DefaultRes = {
  status: 418,
  message: "I'm a little Teapot short and stout"
}

export default function Coffee() {
  const [res, setRes] = useState(DefaultRes)
  const [state, setState] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    if (loading) return
    switch (state) {
      case 0:
        setLoading(true)
        CoffeeAPI.get().then(res => {
          setRes(res)
          setState(c => c + 1)
          setLoading(false)
        })
        break
      case 1:
        setLoading(true)
        CoffeeAPI.post().then(res => {
          setRes(res)
          setState(c => c + 1)
          setLoading(false)
        })
        break
      case 2:
        setLoading(true)
        CoffeeAPI.put().then(res => {
          setRes(res)
          setState(c => c + 1)
          setLoading(false)
        })
        break
      case 3:
        setLoading(true)
        CoffeeAPI.patch().then(res => {
          setRes(res)
          setState(c => c + 1)
          setLoading(false)
        })
        break
      case 4:
        setLoading(true)
        CoffeeAPI.delete().then(res => {
          setRes(res)
          setState(c => c + 1)
          setLoading(false)
        })
        break
      case 5:
        setRes(DefaultRes)
        setState(0)
        break
    }
  }

  return <Error onClick={handleClick} {...res} />
}
