import { authTypeDefs } from "./auth.js";
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
${authTypeDefs}

type Query {
    # Users
    getUsers: [User!]!
    user(id: ID!): User

    # Posts
    getPosts: [Post!]!
    getPost: Post


    # Comments
    getComments(postId: ID!): [Comment!]

    # skills
    userSkills: [Skill!]

    # Notifications
    notifications: [Notification!]


    # Follows
    getFollowers: [User!]
    getFollowing: [User!]

}

type Mutation {

    # Users
    createUser(input: createUserInput): User!
    signIn(email: String!, password: String!): AuthPayload
    updateUser(id: ID!, input: updateUserInput): User
    deleteUser(id: ID!): Boolean!
    
    # Posts
    createPost(input: createPostInput): Post!
    updatePost(id: ID!, input: updatePostInputs): Post


    # Likes
    likeUnlikePost(postId: ID!): likeToggleStatus

    # Comments
    addComment(comment: String!, postId: ID!): Comment
    updateComment(id: ID!, updatedComment: String!): Comment
    deleteComment(id: ID!): Boolean

    # Skills
    addSkill(newSkill: String!): Boolean
    updateSkill(id: ID!, updatedSkill: String!): Boolean
    deleteSkill(id: ID!): Boolean!

    # Notifications
    sendNotificatiion(toUser: ID!, type: String!, message: String!): Notification
    markNotificationRead(id: ID!): Notification

    # Follows
    toggleFollowUser(targetUserId: ID!): FollowResponse
}
`