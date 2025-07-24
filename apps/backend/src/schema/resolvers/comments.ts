import { GraphQLError } from "graphql";
import { MyContext } from "../../server.js";


export const commentResolvers = {
    Query: {
        getComments: async (_: any, args: { postId: string }, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('UNAUTHENTICATED!');
            }
            try {
                return await context.prisma.comment.findMany({
                    where: { postId: args.postId }
                })
            } catch (error) {
                throw new GraphQLError('Error while fetching comments');
            }
        }
    },

    Mutation: {
        addComment: async (_: any, args: { comment: string, postId: string }, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('UNAUTHENTICATED!');
            }
            try {
                return context.prisma.comment.create({
                    data: {
                        text: args.comment,
                        postId: args.postId,
                        userId: context.userId
                    }
                })
            } catch (error) {
                throw new GraphQLError('Error while creating new comment')
            }
        },

        updateComment: async (_:any, args: { id: string, updatedComment: string }, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('UNAUTHENTICATED!');
            }
            try {
                const oldComment = await context.prisma.comment.findUnique({
                    where: { id: args.id }
                })
                if (!oldComment) {
                    throw new GraphQLError('Comment that you are trying to update does not exist');
                }
                if (oldComment.userId !== context.userId) {
                    throw new GraphQLError('Unauthorized to update this comment')
                }
                return await context.prisma.comment.update({
                    where: { id: args.id },
                    data: {
                        text: args.updatedComment
                    }
                })
            } catch (error) {
                throw new GraphQLError('Error while updating comment');
            }
        },

        deleteComment: async (_: any, args: { id: string }, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('UNAUTHENTICATED!');
            }
            try {
                const oldComment = await context.prisma.comment.findUnique({
                    where: { id: args.id }
                })
                if (!oldComment) {
                    throw new GraphQLError('Comment that you are trying to delete does not exist');
                }
                if (oldComment.userId !== context.userId) {
                    throw new GraphQLError('Unauthorized to delete this comment')
                }
                const deleted = await context.prisma.comment.delete({
                    where: { id: args.id }
                })
                return true
            } catch (error) {
                throw new GraphQLError('Unable to delete the comment');
            }
        }
    }
}