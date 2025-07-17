import { MyContext } from "../../server.js";

type userInput = {
    name: string;
    email: string;
    password: string;
    username: string;
    age: number;
    gender: string;
    bio: string;
}

export const userResolvers = {
    Query: {
        getUsers: async (_: any, __: any, context: MyContext) => {
            return await context.prisma.user.findMany({
                include: {
                    posts: true,
                    likes: true,
                    comments: true,
                    skills: true,
                    followers: true,
                    following: true,
                    notifications: true,
                    sentNotifications: true
                }
            });
        },

        user: async (_:any , args: {id: string}, context: MyContext) => {
            return await context.prisma.user.findUnique({
                where: {
                    id: args.id
                },
                include: {
                    posts: true,
                    likes: true,
                    comments: true,
                    skills: true,
                    followers: true,
                    following: true,
                    notifications: true,
                    sentNotifications: true
                }
            })
        },
    },

    Mutation: {
        createUser: async (parent:any , args: { input: userInput }, context: MyContext) => {
            const user = args.input;
            const newUser = await context.prisma.user.create({
                data: user
            })
            return newUser;
        },

        updateUser: async(_: any, args: { id: string, input: userInput }, context: MyContext) => {
            const userData = args.input;
            const id = args.id
            const updatedUser = await context.prisma.user.update({
                where: { id },
                data: userData
            })
            return updatedUser;
        }

    }

}