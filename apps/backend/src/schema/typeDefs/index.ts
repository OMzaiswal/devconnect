import { postTypeDefs } from "./post.js";
import { userTypeDefs } from "./user.js";


export const typeDefs = `#graphql

${userTypeDefs}
${postTypeDefs}

type Query {
        getUsers: [User!]!
        user(id: ID!): User!

        getPosts: [Post!]!
        post: Post!

}

type Mutation {
    createUser(input: createUserInput): User!

    createPost(input: createPostInput): Post!

    likePost(postId: ID!): Like!
    UnLikePost(postId: ID!): Boolean!


}

`