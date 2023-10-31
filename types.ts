import { Server, Member, Profile } from 'prisma/prisma-client'
import { Server as NetServer, Socket } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'

export type ServerWithMembersAndProfiles = Server & {
  members: (Member & { profile: Profile })[]
} // the members: ()'s (this pair of parentheses is required to bypass a type error)

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}
