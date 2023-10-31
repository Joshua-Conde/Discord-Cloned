import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'
import { NextApiResponseServerIo } from '@/types'

export const config = {
  api: {
    bodyParser: false,
  },
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any

    const io = new ServerIO(httpServer, {
      path: '/api/socket/io', // previously: path: path,
      // why does a typo here not sever my Socket IO connection?
      addTrailingSlash: false,
    })

    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler