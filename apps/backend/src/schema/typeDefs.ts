
export const typeDefs = `#graphql
type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    bio: String!
}

type Query {
        getUsers: [User!]!
        user(id: ID!): User!
}
`