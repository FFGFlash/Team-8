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

export const colors = ['orange', 'hotpink', 'red', 'yellow']

interface PlayerProps {
  data: User
}

const SPEED = 5
const direction = new Vector3()
const frontVector = new Vector3()
const sideVector = new Vector3()

export default function Player({ data }: PlayerProps) {
  const [socket] = useSocket()
  const isOwner = data.id === socket.id
  const [color, setColor] = useState(0)
  const ref = useRef<RigidBodyApi>(null!)
  const rapier = useRapier()
  const [, getControls] = useKeyboardControls()

  //Change Color Mechanic
  const { change_color } = getControls()
  useEffect(() => {
    if (!isOwner || !change_color) return
    const newColor = (color + 1) % colors.length
    setColor(newColor)
    socket.emit('set-color', newColor)
  }, [change_color])
  // useEffect(() => {
  //   if (!isOwner) return
  //   const interval = setInterval(() => {}, 1000 / 30)
  //   return () => clearInterval(interval)
  // }, [])

  useFrame(state => {
    if (!isOwner) return

    const { forward, backward, left, right, jump } = getControls()
    state.camera.position.set(...ref.current.translation().toArray())
    frontVector.set(
      0.2,
      0.2,
      (backward as unknown as number) - (forward as unknown as number)
    )
    sideVector.set(
      (left as unknown as number) - (right as unknown as number),
      0.2,
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
      undefined,
      undefined,
      ref.current as unknown as any
    )
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75
    if (jump && grounded) ref.current.setLinvel({ x: 0, y: 12.5, z: 0 })

    const positionalData = {
      position: ref.current.translation().toArray(),
      rotation: ref.current.rotation().toArray()
    }

    socket.emit('update-positional-data', positionalData)
  })

  return (
    <RigidBody
      ref={ref}
      mass={1}
      type='dynamic'
      position={data.position}
      quaternion={data.rotation}
      enabledRotations={[false, true, false]}
    >
      <CuboidCollider args={[0.5, 0.5, 0.5]}>
        <mesh castShadow>
          <boxGeometry />
          <meshStandardMaterial color={colors[isOwner ? color : data.color]} />
        </mesh>
      </CuboidCollider>
    </RigidBody>
  )
}
