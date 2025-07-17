import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { schema } from './schema/index.js';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface MyContext {
  prisma: PrismaClient;
  userId?: string;
  user?: {
    id: string;
    email: string;
    username: string;
  } | null,
  req: Request;
  res: Response;
}

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer<MyContext>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  '/graphql',
  cors<cors.CorsRequest>({
    origin: 'http://localhost:3000',
    credentials: true
  }),
  express.json(),
  cookieParser(),
  expressMiddleware(server, {
    context: async ({ req, res }): Promise<MyContext> => {
      let userId: string | undefined;
      let user: MyContext['user'] | undefined;

      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '' 

      try {
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'JWT_SECRET') as { userId: string };
          userId = decoded.userId;
        }
        
        if(userId) {
          user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              email: true,
              username: true
            }
          })
        }
      } catch (error) {
        console.error('Authentication Error in GraphQL context:', error);
      }
      
      return { prisma, userId, user, req, res }
    },
  }),
);

await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);