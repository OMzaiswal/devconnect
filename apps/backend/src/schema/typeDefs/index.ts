import { commentTypeDefs } from "./comment.js";
import { followTypeDefs } from "./follow.js";
import { likeTypeDefs } from "./like.js";
import { notificationTypeDefs } from "./notification.js";
import { postTypeDefs } from "./post.js";
import { skillTypeDefs } from "./skill.js";
import { userTypeDefs } from "./user.js";


export const typeDefs = `#graphql

${userTypeDefs}
${postTypeDefs}
${likeTypeDefs}
${commentTypeDefs}
${skillTypeDefs}
${followTypeDefs}
${notificationTypeDefs}

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