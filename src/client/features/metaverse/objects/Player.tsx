/* eslint-disable react/no-unknown-property */
import { useFrame } from '@react-three/fiber'
import {
  RigidBody,
  RigidBodyApi,
  useRapier,
  CuboidCollider
} from '@react-three/rapier'
import { useKeyboardControls } from '@react-three/drei'
import { useEffect, useRef, useState } from 'react'
import useSocket from 'src/client/hooks/useSocket'
import { Vector3 } from 'three'
import { Ray } from '@dimforge/rapier3d-compat'

export const colors = ['lime', 'hotpink', 'red', 'yellow']

interface PlayerProps {
  data: User
}

const SPEED = 5
const direction = new Vector3()
const frontVector = new Vector3()
const sideVector = new Vector3()
const rotation = new Vector3()

export default function Player({ data }: PlayerProps) {
  const [socket] = useSocket()
  const isOwner = data.id === socket.id
  const [color, setColor] = useState(0)
  const ref = useRef<RigidBodyApi>(null!)

  const rapier = useRapier()

  const [, get] = useKeyboardControls()

  const handleClick =
    isOwner &&
    (() => {
      const newColor = (color + 1) % colors.length
      setColor(newColor)
      socket.emit('set-color', newColor)
    })

  useEffect(() => {
    if (!isOwner) return
    const interval = setInterval(() => {
      const positionalData = {
        position: ref.current.translation().toArray(),
        rotation: ref.current.rotation().toArray()
      }

      socket.emit('update-positional-data', positionalData)
    }, 1000 / 30)
    return () => clearInterval(interval)
  }, [])

  useFrame(state => {
    if (!isOwner) return

    const { forward, backward, left, right, jump } = get()
    state.camera.position.set(...ref.current.translation().toArray())
    frontVector.set(
      0,
      0,
      (backward as unknown as number) - (forward as unknown as number)
    )
    sideVector.set(
      (left as unknown as number) - (right as unknown as number),
      0,
      0
    )
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(state.camera.rotation)
    ref.current.setLinvel({ ...direction })

    const world = rapier.world.raw()
    const ray = world.castRay(
      new Ray(ref.current.translation(), { x: 0, y: -1, z: 0 }),
      10,
      false,
      undefined,
      1
    )
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75
    if (jump && grounded) ref.current.setLinvel({ x: 0, y: 7.5, z: 0 })
  })

  return (
    <RigidBody ref={ref} position={data.position} quaternion={data.rotation}>
      <CuboidCollider args={[0.5, 0.5, 0.5]}>
        <mesh onClick={handleClick || undefined}>
          <boxGeometry />
          <meshStandardMaterial color={colors[isOwner ? color : data.color]} />
        </mesh>
      </CuboidCollider>
    </RigidBody>
  )
}
