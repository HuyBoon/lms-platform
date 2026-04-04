import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

// This configuration is used in the Next.js proxy layer.
// We exclude the Prisma adapter and Credentials provider here to avoid 
// database initialization errors during the proxy phase.
export default {
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session
    }
  }
} satisfies NextAuthConfig
