
export const typeDefs = `#graphql
type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    bio: String!
}

type Post {
    id: ID!
    content: String!
    imgUrl: String
    autherId: String!
}

type Query {
        getUsers: [User!]!
        user(id: ID!): User!

        getPosts: [Post!]!
        post: Post!
}
`