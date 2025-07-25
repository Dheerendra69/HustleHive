import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  // Ensure a strong, random secret is provided via environment
  secret: process.env.NEXTAUTH_SECRET,

  // Session configuration: use JWTs, set reasonable maxAge
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT configuration: use separate secret for signing
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Replace with your own secure user lookup
        const user = await verifyUserCredentials(
          credentials!.username,
          credentials!.password
        );n        if (!user) {
          throw new Error('Invalid username or password');
        }
        return { id: user.id, name: user.name, role: user.role };
      },
    }),
  ],

  callbacks: {
    // Attach role and id to session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string || 'user';
      }
      return session;
    },

    // Persist role into JWT on sign in
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'user';
      }
      return token;
    },

    // Optionally, restrict sign-in to certain emails or domains
    async signIn({ user, account }) {
      // Example: only allow users with validated GitHub emails
      if (account?.provider === 'github' && !user.email.endsWith('@yourdomain.com')) {
        return false;
      }
      return true;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
};

export default NextAuth(authOptions);

// Helper: replace this stub with real credential verification logic
async function verifyUserCredentials(username: string, password: string) {
  // Example: lookup in database, bcrypt compare, etc.
  return null;
}