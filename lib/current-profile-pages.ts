import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";
import currentProfile from "./current-profile";
import { db } from "./db";

const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null; // a "current profile" cannot be found
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};

export default currentProfilePages;
