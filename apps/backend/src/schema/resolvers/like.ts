import { GraphQLError } from "graphql";
import { MyContext } from "../../server.js";


export const likeResolvers = {
    Mutation: {
        likeUnlikePost: async (_: any, args: { postId: string }, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('UNAUTHENTICATED!');
            }
            try {
                const existingLike = await context.prisma.like.findUnique({
                    where: {
                        postId_userId: {
                            postId: args.postId,
                            userId: context.userId
                        }
                    }
                })
                if (existingLike) {
                    await context.prisma.like.delete({
                        where: { id: existingLike.id }
                    })
                    return 'UNLIKED';
                } else {
                    const newLike = await context.prisma.like.create({
                        data: {
                            postId: args.postId,
                            userId: context.userId
                        }
                    })
                    if (newLike) {
                        return 'LIKED';
                    }
                }
            } catch(error: any) {
                throw new GraphQLError('Error occured while liking/unliking post: ',error)
            }
        }
    }
}