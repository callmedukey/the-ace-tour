import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDB } from "./db";
import { eq } from "drizzle-orm";

import type { Role } from "./types/enums";

import { verifyPassword } from "./lib/utils/verifyPassword";
import { admin } from "./db/schemas";
import { adminSignInSchema } from "./db/schemas";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsed = await adminSignInSchema.safeParseAsync(credentials);

        if (!parsed.success) {
          throw new Error("Please enter correct username and password");
        }

        const { username, password } = parsed.data;

        const db = await getDB();

        const foundUsers = await db
          .select()
          .from(admin)
          .where(eq(admin.username, username));

        if (!foundUsers.length || foundUsers.length > 1) {
          throw new Error("User does not exist");
        }

        const user = foundUsers[0];

        if (!user.salt || !user.password) {
          throw new Error("Invalid User Config Found. Please contact admin.");
        }

        const verified = await verifyPassword(
          password,
          user.password,
          user.salt
        ).catch(() => false);

        if (!verified) {
          throw new Error("Please enter correct email and password");
        }

        if (!user.username || !user.password || !user.salt) {
          throw new Error("Invalid user data. Please contact admin.");
        }

        return {
          id: user.username,
          username: user.username,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async signIn({ user }) {
      if (user) {
        return true;
      }
      return false;
    },
  },
});
