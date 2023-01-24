import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Loading from './Loading'

export default function LazyOutlet() {
  return (
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  )
}
