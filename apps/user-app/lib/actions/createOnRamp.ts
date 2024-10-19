"use server";
import { z } from "zod";
import db from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NEXT_AUTH } from "../auth";

const tranx = z.object({
  provider: z.string(),
  amount: z.number(),
  //   id: z.number(),
});

const session = await getServerSession(NEXT_AUTH);
type tranx = z.infer<typeof tranx>;

export async function createOnRamp(params: tranx) {
  const validated_data = tranx.safeParse(params);
  if (!validated_data.success) {
    console.log(validated_data.error);
    return {
      msg: "zod error",
    };
  }

  try {
    const token = (Math.random() + 1).toString(36).substring(7);

    await db.onRampTransaction.create({
      data: {
        userId: parseInt(session?.user.id),
        provider: params.provider,
        amount: params.amount,
        token: token,
        date: new Date(),
      },
    });
    return {
      msg: "created successfully",
    };
  } catch (e) {
    console.log(e);
    return {
      msg: "error occured",
    };
  }
}
