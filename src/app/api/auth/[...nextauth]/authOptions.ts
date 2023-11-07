import type { Session } from "@/types/types";
import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { loginUser } from "./auth-utils/loginUser";
import { registerUser } from "./auth-utils/registerUser";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import prisma from "@/lib/prisma";
export const authOptions: AuthOptions = {
  // adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {},
      async authorize(credentials, _req): Promise<any> {
        console.log("auth", credentials);

        try {
          const { authType, username, email, password } = credentials as Record<
            string,
            string
          >;

          if (authType === "register") {
            return await registerUser({ authType, username, email, password });
          }

          if (authType === "login") {
            return await loginUser({ authType, username, password });
          }

          throw new Error("Invalid Credentials");
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    // async signIn() {
    //   return true;
    // },

    // ------------------------------------------------

    async jwt({ token, user }): Promise<typeof token> {
      if (user) {
        const { id, role } = user as typeof user & { role?: string };
        //TODO: Persist the OAuth access_token to the token right after signin
        // token.accessToken = user.access_token;
        token.id = id;
        token.role = role;
      }
      return token;
    },

    // -------------------------------------------------

    async session({ session, token }): Promise<Session> {
      const sess: Session = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        },
      };

      return sess;
    },

    // --------------------------------------------------

    async redirect({ url, baseUrl }): Promise<string> {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
