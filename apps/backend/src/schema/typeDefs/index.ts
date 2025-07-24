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
    post(id: ID!): Post


    # Comments
    getComments(postId: ID!): [Comment!]

    # skills
    userSkills(userId: ID!): [Skill!]

    # Notifications
    notifications(userId: ID!): [Notification!]


    # Follows
    followers(userId: ID!): [User!]
    following(userId: ID!): [User!]

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
    addSkill(newSkill: String!): Skill
    updateSkill(id: ID!, updatedSkill: String!): Skill!
    deleteSkill(id: ID!): Boolean!

    # Notifications
    sendNotificatiion(toUser: ID!, type: String!, message: String!): Notification
    markNotificationRead(id: ID!): Notification

    # Follows
    followUser(followerId: ID!, followingId: ID!): Follow
    unFollowUser(followerId: ID!, followingId: ID!): Boolean!
}
`