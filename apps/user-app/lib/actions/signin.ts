"use server";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { redirect } from "next/navigation";

const User = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type userType = z.infer<typeof User>;

export async function signin(params: userType) {
  const validated_data = User.safeParse(params);
  if (!validated_data.success) {
    console.log(validated_data.error);
    return {
      msg: "zod error",
    };
  }
  const res = await signIn("credentials", {
    email: params.email,
    password: params.password,
    redirect: false,
  });

  if (res?.ok) {
    redirect("/demo");
  }

  console.log(res);
}
