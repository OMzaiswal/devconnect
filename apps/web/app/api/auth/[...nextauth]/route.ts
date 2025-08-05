// apps/web/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { gql, GraphQLClient } from "graphql-request";

const client = new GraphQLClient("http://localhost:4000/graphql");

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const LOGIN_MUTATION = gql`
          mutation Login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              token
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
          const data: any = await client.request(LOGIN_MUTATION, {
            email: credentials?.email,
            password: credentials?.password,
          });

          const user = data.login.user;
          user.token = data.login.token; // attach token manually

          return user;
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
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.token = token.token;
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
