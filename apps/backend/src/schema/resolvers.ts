import { MyContext } from "../server"

export const resolvers = {
    Query: {
        getUsers: async (_: any, __: any, context: MyContext) => {
            return await context.prisma.user.findMany();
        },

        user: async (_:any , args: {id: string}, context: MyContext) => {
            return await context.prisma.user.findUnique({
                where: {
                    id: args.id
                }
            })
        }
    }
}