"use server";
import { PrismaClient } from "@repo/db/client";
import bycrypt from "bcryptjs";
import { z } from "zod";

const User = z.object({
  username: z.string(),
  password: z.string().min(6),
  email: z.string().email(),
});

type userType = z.infer<typeof User>;

const client = new PrismaClient();

export async function signup(params: userType) {
  const validated_data = User.safeParse(params);
  if (!validated_data.success) {
    console.log(validated_data.error);
    return {
      msg: "zod error",
    };
  }

  try {
    const hashedPassword = await bycrypt.hash(params.password, 10);
    await client.user.create({
      data: {
        email: params.email,
        username: params.username,
        password: hashedPassword,
      },
    });
    return {
      msg: "done",
    };
    console.log("done");
  } catch (e) {
    console.log(e);
    return {
      msg: "error occured",
    };
  }
}
