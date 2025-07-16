import { MyContext } from "../../server.js";


export const postResolvers = {

    Query: {
        getPosts: async(_:any, __:any, context: MyContext) => {
            return await context.prisma.post.findMany();
        },

        post: async(_:any, args: {id: string}, context: MyContext) => {
            return await context.prisma.post.findUnique({ 
                where: { id: args.id }
            })
        }
    }
}