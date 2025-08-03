import { GraphQLError } from "graphql";
import { MyContext } from "../../server.js";

export const notificationResolvers = {
    Query: {
        notification: async (_: any, __: any, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('UNAUTHENTICATED!');
            }
            try {
                const notifications = await context.prisma.notification.findMany({
                    where: {
                        userId: context.userId
                    }
                })
                return notifications;
            } catch (error) {
                throw new GraphQLError('Error while fetching notifications');
            }
        }
    },

    Mutation: {
        sendNotification: async (
            _: any, 
            args: { toUser: string, type: string, message: string },
            context: MyContext
        ) => {
            if (!context.userId) {
                throw new GraphQLError('UNAUTHENTICATED!');
            }
            if (args.toUser === context.userId) {
                throw new GraphQLError("You can't send a notification to yourself.");
            }
            try {
                const notification = await context.prisma.notification.create({
                    data: {
                        type: args.type,
                        message: args.message,
                        userId: args.toUser,
                        fromUserId: context.userId
                    }
                })
                return notification;
            } catch (error) {
                console.error("Error sending notification:", error);
                throw new GraphQLError("Failed to send notification");
            }
        },

        markNotificationRead: async (_: any, args: { id: string}, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('UNAUTHENTICATED!');
            }
            try {
                const notification = await context.prisma.notification.findUnique({
                    where: { id: args.id }
                })
                if (!notification) {
                    throw new GraphQLError("Notification not found.");
                }
                if (notification.userId !== context.userId) {
                    throw new GraphQLError("Unauthorized: Cannot mark this notification as read.");
                }
                const updatedNotification = await context.prisma.notification.update({
                    where: { id: args.id },
                    data: { read: true }
                })
                return updatedNotification;
            } catch (error) {
                console.error("Error marking notification as read:", error);
                throw new GraphQLError("Failed to mark notification as read.");
            }
        }
    }
}