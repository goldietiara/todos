import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { TypeSession } from "@/types";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import NextAuth, { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { User as UserAccount } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  // adapter: PrismaAdapter(prisma as PrismaClient) as Adapter,
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  theme: {
    colorScheme: "light",
    logo: "/chiyo-chichi-fliped.PNG",
  },
  callbacks: {
    async session({ session }) {
      const userEmail = session?.user?.email as string;
      try {
        const data = (await prisma.user.findUnique({
          where: { email: userEmail },
        })) as UserAccount;
        const newSession = {
          ...session,
          user: {
            ...session.user,
            ...data,
          },
        };
        return newSession;
      } catch (error: any) {
        console.error("Error retrieving user data: ", error.message);
        return session;
      }
    },

    async signIn({ user }: { user: AdapterUser | User }) {
      try {
        const userExists = (await prisma.user.findUnique({
          where: { email: user?.email as string },
        })) as UserAccount;

        if (!userExists) {
          await prisma.user.create({
            data: {
              name: user.name as string,
              email: user.email as string,
              image: user.image as string,
            },
          });
        }

        console.log(userExists);
        return true;
      } catch (error: any) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

export async function getCurrentUser() {
  const session = (await getServerSession(authOptions)) as TypeSession;

  return session;
}
