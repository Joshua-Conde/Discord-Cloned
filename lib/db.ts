import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();
// ^ this is the way to uphold a singleton pattern for the prisma client while admist this application's development; a hot (cache) reload will, without this, be to blame for the creation of a NEW prisma client; one created on every made request
// "globalThis" is, thankfully, unaffected by hot (cache) reloads

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
