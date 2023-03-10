import { Server, Socket } from 'socket.io'
import type { Server as HTTPServer } from 'http'

let connections: { socket: Socket; user: Partial<User> }[] = []

export default function createSocket(server: HTTPServer) {
  const io = new Server(server)

  io.on('connection', socket => {
    // eslint-disable-next-line no-console
    console.log(socket.id, 'connected')

    connections.forEach(conn =>
      socket.emit('user-added', conn.socket.id, conn.user)
    )

    const user: Partial<User> = {
      position: [(Math.random() - 0.5) * 10, 1.5, (Math.random() - 0.5) * 10],
      rotation: [0, (Math.random() - 0.5) * Math.PI * 2, 0, 0],
      color: 0
    }

    connections.push({ socket, user })
    io.emit('user-added', socket.id, user)

    socket.on('set-color', color => {
      const connIndex = connections.findIndex(
        conn => conn.socket.id === socket.id
      )
      connections[connIndex].user.color = color
      socket.broadcast.emit('user-color', socket.id, color)
    })

    socket.on('update-positional-data', ({ position, rotation }) => {
      const connIndex = connections.findIndex(
        conn => conn.socket.id === socket.id
      )
      connections[connIndex].user.position = position
      connections[connIndex].user.rotation = rotation
      socket.broadcast.emit(
        'user-update-positional-data',
        socket.id,
        position,
        rotation
      )
    })

    socket.on('disconnect', () => {
      connections = connections.filter(conn => conn.socket.id !== socket.id)
      io.emit('user-removed', socket.id)
    })
  })

  return io
}
