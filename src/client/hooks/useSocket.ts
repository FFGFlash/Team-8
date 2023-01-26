import { io, Socket } from 'socket.io-client'

type AddEventListenerFunc = (
  event: string,
  listener: (...args: any[]) => void
) => () => void

const socket = io()

export default function useSocket(): [Socket, AddEventListenerFunc] {
  const addEventListener: AddEventListenerFunc = (event, listener) => {
    socket.on(event, listener)
    return () => socket.off(event, listener)
  }

  return [socket, addEventListener]
}
