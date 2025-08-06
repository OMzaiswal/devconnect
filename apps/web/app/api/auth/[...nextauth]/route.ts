// apps/web/app/api/auth/[...nextauth]/route.ts
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { gql, GraphQLClient } from "graphql-request";

const client = new GraphQLClient("http://localhost:4000/graphql");


type LoginResponse = {
  login: {
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
      gender: string;
      age: number;
      bio: string;
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
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              user {
                id
                email
                username
                name
                gender
                age
                bio
              }
            }
          }
        `;

        try {
          const { login }: LoginResponse = await client.request(LOGIN_MUTATION, {
            email: credentials?.email,
            password: credentials?.password,
          });

          return login.user;
        } catch (err) {
          console.error("Login failed:", err);
          return null;
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
  // pages: {
  //   signIn: "/login",
  // },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
