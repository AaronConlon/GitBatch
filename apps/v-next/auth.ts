import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const GITHUB_ID = process.env.AUTH_GITHUB_ID!;
const GITHUB_SECRET = process.env.AUTH_GITHUB_SECRET!;

const authInstance = NextAuth({
  providers: [
    GitHub({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      authorization: {
        params: { scope: "user:email read:user repo" },
      },
    }),
  ],
});

export const { handlers, signIn, signOut, auth } = authInstance;
