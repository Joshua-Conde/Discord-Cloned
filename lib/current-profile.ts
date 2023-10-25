import { auth } from '@clerk/nextjs'
import { db } from './db'

const currentProfile = async () => {
  const { userId } = auth()

  if (!userId) {
    return null // a "current profile" cannot be found
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  })

  return profile
}

export default currentProfile
