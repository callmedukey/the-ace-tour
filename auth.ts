import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDB } from "./db";
import { eq } from "drizzle-orm";
import { users, userSignInSchema } from "./db/schemas";
import type { Role } from "./types/enums";

import { verifyPassword } from "./lib/utils/verifyPassword";

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
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsed = await userSignInSchema.safeParseAsync(credentials);

        if (!parsed.success) {
          throw new Error("Please enter correct email and password");
        }

        const { email, password } = parsed.data;

        const db = await getDB();

        const foundUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

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

        if (!user.id || !user.email || !user.name || !user.role) {
          throw new Error("Invalid user data. Please contact admin.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
});
