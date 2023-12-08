import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Member, Profile, Server } from 'prisma/prisma-client'
import { Server as SocketIOServer } from 'socket.io'

// experimental

export type ServerWithMembersAndProfiles = Server & {
  members: (Member & { profile: Profile })[]
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}
