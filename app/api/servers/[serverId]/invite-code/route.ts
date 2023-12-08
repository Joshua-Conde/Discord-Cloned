import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import currentProfile from "../../../../../lib/current-profile";
import { db } from "../../../../../lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id, // this check, does indeed, guarentee that ONLY admins are allowed to perform this task
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server); // no "new?"
    // we suffer from continued 404's... (a good reason for our needing to create a new "invite" route group)
  } catch (error) {
    console.log("/api/servers/[serverId]/route.ts: ", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
