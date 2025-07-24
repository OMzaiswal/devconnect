

export const likeTypeDefs = `#graphql
type Like {
    id: ID!
    post: Post!
    user: User!
}

enum likeToggleStatus {
    LIKED
    UNLIKED
}
`