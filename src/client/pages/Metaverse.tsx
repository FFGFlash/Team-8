/* eslint-disable react/no-unknown-property */
import tw from 'twin.macro'
import { Suspense, useEffect, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import {
  Sky,
  KeyboardControls,
  PointerLockControls,
  Environment,
  OrbitControls
} from '@react-three/drei'
import Loading from '../components/Loading'
import useSocket from '../hooks/useSocket'
import Player from '../features/metaverse/objects/Player'
import envmap from 'client/assets/textures/envmap.hdr'
import { Physics } from '@react-three/rapier'
import Ground from '../features/metaverse/objects/Ground'
import isMobileDevice from '../utils/isMobileDevice'
import Box from '../features/metaverse/objects/Box'

export default function Metaverse() {
  return (
    <Suspense fallback={<Loading />}>
      {isMobileDevice() ? <Mobile /> : <Desktop />}
    </Suspense>
  )
}

function Desktop() {
  const [, addEventListener] = useSocket()

  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const disconnects = [
      addEventListener('user-added', (id, user) =>
        setUsers(curr => [...curr, { ...user, id }])
      ),
      addEventListener('user-removed', id =>
        setUsers(curr => curr.filter(user => user.id !== id))
      ),
      addEventListener('user-color', (id, color) =>
        setUsers(curr =>
          curr.map(user => (user.id === id ? { ...user, color } : user))
        )
      ),
      addEventListener(
        'user-update-positional-data',
        (id, position, rotation) => {
          setUsers(curr =>
            curr.map(user =>
              user.id === id ? { ...user, position, rotation } : user
            )
          )
        }
      )
    ]

    return () => disconnects.forEach(disconnect => disconnect())
  })

  const w = window as never as {
    users: typeof users
  }
  w.users = users

  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
        { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
        { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
        { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
        { name: 'jump', keys: ['Space'] }
      ]}
    >
      <Scene shadows camera={{ fov: 45 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.3} />
        <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />

        <Physics gravity={[0, -30, 0]}>
          <Ground />
          {users.map(user => (
            <Player key={user.id} data={user} />
          ))}
        </Physics>
        <PointerLockControls />
      </Scene>
    </KeyboardControls>
  )
}

function Mobile() {
  return (
    <Scene>
      <Environment files={envmap} background />
      <OrbitControls />
      <ambientLight intensity={0.3} />
      <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
      <Box />
    </Scene>
  )
}

const Scene = tw(Canvas)`w-full h-full`
