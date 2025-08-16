

export const postTypeDefs = `#graphql
type Post {
    id: ID!
    content: String!
    imgUrl: String
    author: User!
    likes: [Like!]!
    comments: [Comment!]!
}

input CreatePostInput {
    content: String!
    imgUrl: String
    authorId: ID!
}

input UpdatePostInputs {
    content: String
    imgUrl: String
}
`