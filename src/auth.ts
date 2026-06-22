import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { bootstrapGitHubUserProfile } from "@/lib/auth/profile-bootstrap";
import { getPrismaClient } from "@/lib/db";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      if (!session.user?.email) {
        return session;
      }

      const prisma = getPrismaClient();
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          developerProfile: { select: { handle: true } },
          username: true,
        },
      });

      if (user) {
        Object.assign(session.user, {
          id: user.id,
          handle: user.developerProfile?.handle,
          username: user.username,
        });
      }

      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider !== "github" || !profile) {
        return false;
      }

      const prisma = getPrismaClient();

      await bootstrapGitHubUserProfile(prisma, {
        accountScope: account.scope,
        profile,
      });

      return true;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
});
