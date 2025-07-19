import { GraphQLError } from "graphql";
import { MyContext } from "../../server.js";

type createPostInput = {
    content: string;
    imgUrl: string;
    authorId: string;
}

export const postResolvers = {

    Query: {
        getPosts: async(_:any, __:any, context: MyContext) => {
            if(!context.userId) {
                throw new GraphQLError('Unauthenticated! You are not logged in')
            }
            try {
                return await context.prisma.post.findMany({
                    where: { authorId: context.userId }
                });
            } catch(error) {
                throw new GraphQLError('Failed to create posrt');
            } 
        },

        post: async(_:any, args: {id: string}, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('Unauthenticated! You are not logged in');
            }
            return await context.prisma.post.findUnique({ 
                where: { id: args.id }
            })
        }
    },

    Mutation: {
        createPost: async (_: any, args: { input: createPostInput }, context: MyContext) => {
            if(!context.userId) {
                throw new GraphQLError('Unauthenticated! You are not logged in');
            }
            const newPost = await context.prisma.post.create({
                data: {
                    ...args.input
                },
                select: {
                    id: true,
                    content: true,
                    imgUrl: true
                }
            })
            return newPost;
        }
    }
}