import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../../../lib/auth";

const getSession = async () => {
  const session = await getServerSession(NEXT_AUTH);

  return NextResponse.json({
    session,
  });
};

export { getSession as GET };
