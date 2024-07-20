import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

const GITHUB_ID = process.env.AUTH_GITHUB_ID!;
const GITHUB_SECRET = process.env.AUTH_GITHUB_SECRET!;

const authInstance = NextAuth({
  providers: [
    GitHub({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      authorization: {
        params: { scope: 'user:email read:user repo delete_repo' }
      }
    })
  ],
  callbacks: {
    // 添加此回调以获取并返回accessToken
    async jwt({ token, account }) {
      // 如果此次登录操作包含account信息，则表示登录流程刚完成
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // 将accessToken传递给客户端的session中
      // @ts-ignore
      session.accessToken = token.accessToken;
      return session;
    }
  },
  trustHost: true
});

export const { handlers, signIn, signOut, auth } = authInstance;
