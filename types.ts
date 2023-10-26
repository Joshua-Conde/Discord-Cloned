import { Server, Member, Profile } from 'prisma/prisma-client'

export type ServerWithMembersAndProfiles = Server & {
  members: (Member & { profile: Profile })[]
} // the members: ()'s (this pair of parentheses is required to bypass a type error)
