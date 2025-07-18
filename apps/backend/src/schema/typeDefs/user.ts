
export const userTypeDefs = `#graphql
type User {
    id: ID!
    name: String!
    email: String!
    username: String!
    gender: String
    age: Int
    bio: String
    posts: [Post!]!
    likes: [Like!]!
    comments: [Comment!]!
    skills: [Skill!]!
    followers: [Follow!]!
    following: [Follow!]!
    notifications: [Notification!]!
    sentNotifications: [Notification!]!
}

input createUserInput {
    name: String!
    email: String!
    password: String!
    username: String!
    age: Int
    gender: String
    bio: String
}

input updateUserInput {
    name: String
    email: String
    password: String
    username: String
    age: Int
    gender: String
    bio: String
}

`