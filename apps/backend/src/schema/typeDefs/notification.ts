

export const notificationTypeDefs = `#graphql
type Notification {
    id: ID!
    type: String!
    message: String!
    user: User!
    fromUser: User!
    read: Boolean!
    createdAt: String!
}`