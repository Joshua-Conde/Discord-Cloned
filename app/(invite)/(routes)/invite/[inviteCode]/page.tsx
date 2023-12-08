import { redirectToSignIn } from "@clerk/nextjs";
import currentProfile from "../../../../../lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "../../../../../lib/db";

export default async function InviteCodePage({
  params,
}: {
  params: { inviteCode: string };
}) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  // the below covers the case where a server member ever tries to RE-JOIN a server that they're already in

  // what about findUnique?
  const existingServer = await db.server.findFirst({
    where: {
      // "where" encloses ALL of the below
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.update({
    where: {
      // "where," here, in contrast, ONLY encloses the below inviteCode
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          // an ARRAY of objects
          {
            profileId: profile.id, // anybody new to a server is of role "GUEST" by default
          },
        ],
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
}

// ANY modifications made to our schema.prisma should be folllowed by an npx prisma migrate reset
