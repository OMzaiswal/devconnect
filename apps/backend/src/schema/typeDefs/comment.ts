
export const commentTypeDefs = `#graphql
type Comment {
    id: ID!
    text: String
    post: Post!
    user: User!
    createdAt: String!
}
`