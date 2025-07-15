
export const typeDefs = `#graphql
type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    username: String!
    bio: String!
    posts: [Post!]!
    likes: [Like!]!
    comments: [Comment!]!
    skills: [Skill!]!
    followers: [Follow!]!
    following: [Follow!]!
    notifications: [Notification!]!
    sentNotifications: [Notification!]!
}

type Post {
    id: ID!
    content: String!
    imgUrl: String
    author: User!
    likes: [Like!]!
    comments: [Comment!]!
}

type Like {
    id: ID!
    post: Post!
    user: User!
}

type Comment {
    id: ID!
    text: string
    post: Post!
    user: User!
    createdAt: string!
}

type Skill {}

type Follow{}

type Notification {}



type Query {
        getUsers: [User!]!
        user(id: ID!): User!

        getPosts: [Post!]!
        post: Post!
}

input createUserInput {
    name: String!
    email: String!
    password: String!
    bio: String!
}

type Mutation {
    createUser(input: createUserInput): User!
}
`