/* eslint-disable react/no-unknown-property */

import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
const colors = ['lime', 'hotpink', 'red', 'yellow']


export default function Box() {

    const boxRef = useRef()
    const [color, setColor] = useState(0)
    const handleClick = () => setColor(curr => (curr + 1) % colors.length)

    useFrame(() => {
        if(!boxRef.current) return
        boxRef.current.rotation.x += 0.01
        boxRef.current.rotation.y += 0.01
    })

  return (
    <mesh ref={boxRef} castShadow receiveShadow onClick={handleClick}>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial attach="material" color={colors[color]} />
    </mesh>
  )
}
