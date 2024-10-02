import { NextResponse } from "next/server";
import { PrismaClient } from "@repo/db/client";

const client = new PrismaClient();

export const GET = async () => {
  await client.user.create({
    data: {
      username: "asd",
      email: "345456576",
      password: "asdmsdnfs",
    },
  });
  return NextResponse.json({
    message: "hi there",
  });
};
