import { GraphQLError } from "graphql";
import { MyContext } from "../../server.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

type CreateUserInput = {
    name: string;
    email: string;
    password: string;
    username: string;
    age?: number;
    gender?: string;
    bio?: string;
}

type UpdateUserInput = {
    name?: string;
    email?: string;
    password?: string;
    username?: string;
    age?: number;
    gender?: string;
    bio?: string;
}

export const userResolvers = {
    Query: {
        getUsers: async (_: any, __: any, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('Authentication required to list users');
            }
            try {
                return await context.prisma.user.findMany({
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                        gender: true,
                        age: true,
                        bio: true
                    }
                })
            } catch (error) {
                throw new GraphQLError('Failed to fetch users');
            }
        },

        user: async (_:any , args: {id: string}, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('Authentication required to list user details');
            }
            try {
                const user =  await context.prisma.user.findUnique({
                    where: { id: args.id },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                        gender: true,
                        age: true,
                        bio: true
                    }
                })
                if (!user) {
                    throw new GraphQLError('User not found!')
                }
                return user;
            } catch (error) {
                throw new GraphQLError('Failed to fetch user');
            }
        },
    },

    Mutation: {
        createUser: async (parent:any , args: { input: CreateUserInput }, context: MyContext) => {
            try {
                const hashedPassword = await bcrypt.hash(args.input.password, 10);
                const user = await context.prisma.user.create({
                    data: {
                        ...args.input,
                        password: hashedPassword
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                        gender: true,
                        age: true,
                        bio: true
                    }
                })
                // const { password: _, ...userWithoutPassword } = user;
                return user;
            } catch (error: any) {
                if (error.code === 'P2002') {
                    throw new GraphQLError('Email or username is already in use');
                }
                throw new GraphQLError('Failed to create user')
            }
            
        },

        signIn: async (_: any, args: { email: string, password: string }, context: MyContext) => {
            const { email, password } = args;
            try {
                const user = await context.prisma.user.findUnique({
                    where: { email }
                })
                if (!user) {
                    throw new GraphQLError("User doesn't exist! You must login first.")
                }
                const isPasswordValid = await bcrypt.compare(password, user.password);
                if (!isPasswordValid) {
                    throw new GraphQLError("Invalid crcedentials");
                }

                const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || '', { expiresIn: '7d' });
                const { password: _, ...userWithoutPassword } = user;
                return { token, user: userWithoutPassword };
            } catch (error) {
                throw new GraphQLError('Internal server error')
            }
        },

        updateUser: async(_: any, args: { id: string, input: UpdateUserInput }, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('Unauthenticated!');
            }
            const { id , input }= args
            if ( id !== context.userId ) {
                throw new GraphQLError('Unauthorized to update this user!')
            }
            try {
                if (input.password) {
                    input.password = await bcrypt.hash(input.password, 10);
                }
                const updatedUser = await context.prisma.user.update({
                    where: { id },
                    data: input,
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        username: true,
                        gender: true,
                        age: true,
                        bio: true,
                    }
                })
                return updatedUser;
            } catch (error: any) {
                console.error(`Error updating user with ID ${id}:`, error); // Log for debugging
                if (error.code === 'P2025') { // Prisma record not found
                    throw new GraphQLError(`User with ID ${id} not found.`, {
                        extensions: { code: 'NOT_FOUND' }
                    });
                }
                if (error.code === 'P2002') { // Unique constraint violation on update
                    const targetField = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : error.meta?.target || 'unknown field';
                    throw new GraphQLError(`The provided ${targetField} is already in use by another user.`, {
                        extensions: { code: 'UNIQUE_CONSTRAINT_VIOLATION', field: targetField },
                    });
                }
                throw new GraphQLError('Failed to update user.', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: error.message || 'An unknown error occurred.' }
                });
            }
        },

        deleteUser: async (_: any, args: { id: string }, context: MyContext) => {
            if (!context.userId) {
                throw new GraphQLError('Unauthenticated!');
            }
            if ( args.id !== context.userId ) {
                throw new GraphQLError('Unauthorized to delete this user!');
            }
            try {
                const response = await context.prisma.user.delete({
                    where: { id: args.id }
                })
                if (response) {
                    return true;
                }
            } catch (error: any) {
                if (error.code === 'P2025') {
                    throw new GraphQLError('User does not exist');
                }
                else {
                    throw new GraphQLError('Unable to delete user!!!');
                }
            }
        }
    },


    User: {
        posts: async (parent: any, _: any, context: MyContext) => {
            return await context.prisma.post.findMany({
                where: { authorId: parent.id },
                select: {
                    id: true,
                    content: true,
                    imgUrl: true
                }
            })
        },

        // likes: async (parent: any, _:any, context: MyContext) => {
            
        // }
    }
}