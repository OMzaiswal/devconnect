import { GraphQLError } from "graphql";
import { MyContext } from "../../server.js";

type createPostInput = {
    content: string;
    imgUrl?: string;
    authorId: string;
}

type updatePostInputs = {
    content?: string;
    imgUrl?: string;
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
                throw new GraphQLError('Failed to fetch posts');
            } 
        },

        post: async(_:any, args: {id: string}, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('Unauthenticated! You are not logged in');
            }
            try {
                return await context.prisma.post.findUnique({ 
                    where: { id: args.id }
                })
            } catch (error) {
                throw new GraphQLError('Failed to fetchh post')
            }
            
        }
    },

    Mutation: {
        createPost: async (_: any, args: { input: createPostInput }, context: MyContext) => {
            if(!context.userId) {
                throw new GraphQLError('Unauthenticated! You are not logged in');
            }
            try {
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
            } catch (error) {
                throw new GraphQLError('Unable to create post!!');
            }  
        },

        updatePost: async (_: any, args: { id: string, input: updatePostInputs }, context: MyContext) => {
            if(!context.userId) {
                throw new GraphQLError('Unauthenticated! You are not logged in');
            }
            try {
                const oldPost = await context.prisma.post.findUnique({
                    where: { id: args.id }
                })

                if(!oldPost) {
                    throw new GraphQLError('Post does not exist!');
                }

                if (oldPost.authorId === context.userId) {
                    const updatedPost = await context.prisma.post.update({
                        where: { id: args.id },
                        data: { ...args.input },
                        select: {
                            id: true,
                            content: true,
                            imgUrl: true
                        }
                    })
                    return updatedPost;
                } else {
                    throw new GraphQLError('Unauthorized to edit this post!');
                }
            } catch(error) {
                throw new GraphQLError('Unable to edit post');
            }
        },

        deletePost: async (_: any, args: { id: string }, context: MyContext) => {
            if(!context.userId) {
                throw new GraphQLError('Unauthenticated! You are not logged in');
            }
            try {
                const oldPost = await context.prisma.post.findUnique({
                    where: { id: args.id }
                })
                if (!oldPost) {
                    throw new GraphQLError('Post does not exist!');
                }
                if (oldPost.authorId !== context.userId) {
                    throw new GraphQLError('Unauthorized to delete this post!');
                }
                await context.prisma.post.delete({
                    where: { id: args.id }
                });
                return true
            } catch (error) {
                throw new GraphQLError('Unable to delete this post!');
            }
        }
    }
}