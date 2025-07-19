

export const postTypeDefs = `#graphql
type Post {
    id: ID!
    content: String!
    imgUrl: String
    author: User!
    likes: [Like!]!
    comments: [Comment!]!
}

input createPostInput {
    content: String!
    imgUrl: String
    authorId: ID!
}
`