import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { PrismaClient } from "@repo/db/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const client = new PrismaClient();

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type signinType = z.infer<typeof signinSchema>;

export const NEXT_AUTH: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "johndoe@email.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "******",
        },
      },

      async authorize(credentials: any) {
        const res = signinSchema.safeParse(credentials);
        if (!res.success) {
          console.log("zod error");
          return null;
        }
        const user = await client.user.findUnique({
          where: {
            email: credentials.email,
          },
          select: {
            id: true,
            password: true,
            email: true,
            username: true,
          },
        });

        if (!user) {
          console.log("user not exist");
          return null;
        }

        const password = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!password) {
          console.log("password incorrect");
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          username: user.username,
          msg: "done",
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || " ",
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    jwt: async ({ user, token }: any) => {
      if (user) {
        token.name = user.username;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
