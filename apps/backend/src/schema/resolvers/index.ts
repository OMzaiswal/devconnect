import { postResolvers } from "./post.js";
import { userResolvers } from "./user.js";


export const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...postResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
    
    }
}