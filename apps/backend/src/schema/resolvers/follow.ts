import { GraphQLError } from "graphql";
import { MyContext } from "../../server.js";

export const followResolvers = {
    Query: { 
        getFollowers: async (_: any, __: any, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('UNAUTHENTICATED!');
            }
            try {
                return await context.prisma.follow.findMany({
                    where: { followingId: context.userId }
                })
            } catch (error) {
                throw new GraphQLError('Error while fetching folllowers');
            }
        },

        getFollowing: async (_: any, __: any, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('UNAUTHENTICATED!');
            }
            try {
                return await context.prisma.follow.findMany({
                    where: { followerId: context.userId }
                })
            } catch (error) {
                throw new GraphQLError('Error while fetching folllowing');
            }

        }
    },
    
    Mutation: {
        toggleFollowUser: async (_: any, args: { targetUserId: string }, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('UNAUTHENTICATED!');
            }
            if (context.userId === args.targetUserId) {
                throw new GraphQLError('Cannot follow yourself');
            }
            try {
                const existingFollow = await context.prisma.follow.findUnique({
                    where: {
                        followerId_followingId: {
                            followerId: context.userId,
                            followingId: args.targetUserId
                        }
                    }
                })
                if (existingFollow) {
                    //  already following, so need to unfollow
                    await context.prisma.follow.delete({
                        where: {
                            followerId_followingId: {
                                followerId: context.userId,
                                followingId: args.targetUserId
                            }
                        }
                    })
                    return { followed: false };
                } else {
                    //  not following, so need to follow
                    await context.prisma.follow.create({
                        data: {
                            followerId: context.userId,
                            followingId: args.targetUserId
                        }
                    })
                    return { followed: true };
                }
            } catch (error) {
                throw new GraphQLError('Unable to follow/Unfollow toggle');
            }
        }
    }
}