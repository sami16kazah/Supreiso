import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "./mongoose";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const { email, name } = user;
        try {
          await dbConnect();
          const userExists = await User.findOne({ email });

          if (!userExists) {
            await User.create({
              email,
              name,
              role: (email === "samkazah444@gmail.com" || email === "samkazah444@gamil.com") ? "admin" : "client",
            });
          } else {
            // Force role upgrade if already exists as client
            if ((email === "samkazah444@gmail.com" || email === "samkazah444@gamil.com") && userExists.role !== "admin") {
              userExists.role = "admin";
              await userExists.save();
            }
          }
          return true;
        } catch (error) {
          console.error("Error creating user", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      await dbConnect();
      const sessionUser = await User.findOne({ email: session?.user?.email });

      if (sessionUser && session.user) {
        (session.user as any).id = sessionUser._id.toString();
        (session.user as any).role = sessionUser.role;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
