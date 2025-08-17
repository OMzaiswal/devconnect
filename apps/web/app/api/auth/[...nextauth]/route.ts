// apps/web/app/api/auth/[...nextauth]/route.ts
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { gql, GraphQLClient } from "graphql-request";

const client = new GraphQLClient("http://localhost:4000/graphql", {
  headers: {
    'Content-Type': 'application/json'
  }
});


type LoginResponse = {
  signIn: {
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
      // gender: string;
      // age: number;
      // bio: string;
    };
  };
};

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials): Promise<User | null> {
        const LOGIN_MUTATION = gql`
          mutation SignIn($input: SignInInput!) {
            signIn(input: $input) {
              user {
                id
                email
                username
                name
                # gender
                # age
                # bio
              }
            }
          }
        `;

        try {
          const { signIn }: LoginResponse = await client.request(LOGIN_MUTATION, 
            {
              input: {
                email: credentials?.email,
                password: credentials?.password,
              }
          });
          // console.log(signIn.user)
          if (!signIn?.user) {
            // 🔹 Better error message when user not found
            throw new Error("Invalid email or password.");
          }
          return signIn.user;
        } catch (err: any) {
          // console.error("Login failed:", err);
          throw new Error(
            err.response?.errors?.[0]?.message ||
            "Unable to login. Please check your credentials and try again."
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.username = token.username;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
