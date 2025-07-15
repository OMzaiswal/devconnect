import { MyContext } from "../server"

type createUserInput = {
    name: String;
    email: String;
    password: String;
    bio: String;
}

export const resolvers = {
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

        getPosts: async(_:any, __:any, context: MyContext) => {
            return await context.prisma.post.findMany();
        },

        post: async(_:any, args: {id: string}, context: MyContext) => {
            return await context.prisma.post.findUnique({ 
                where: { id: args.id }
            })
        }
    },

    Mutation: {
        createUser: (parent:any , args: { input: createUserInput }) => {
            const user = args.input;
            return user;
        }
    }
}