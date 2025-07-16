

export const followTypeDefs = `#graphql
type Follow{
    id: ID!
    follower: User!
    following: User!
    createdAt: String!
}
`