import { GraphQLError } from "graphql";
import { MyContext } from "../../server.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { CreateUserSchema, UpdateUserSchema, CreateUserInput, UpdateUserInput, SignInSchema, SignInInput } from "@my-monorepo/common";
import { formatZodError } from "../../utils/errors/index.js";
import { ZodError } from 'zod';

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
                const validatedInput = CreateUserSchema.parse(args.input);
                const hashedPassword = await bcrypt.hash(validatedInput.password, 10);
                const user = await context.prisma.user.create({
                    data: {
                        ...validatedInput,
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
                return user;
            } catch (error: any) {
                if (error instanceof GraphQLError) {
                    throw error;
                }
                if (error instanceof ZodError) {
                    throw formatZodError(error);
                }
                if (error.code === 'P2002') {
                    console.error("Prisma unique constraint error creating user:", error);
                    throw new GraphQLError('Email or username is already in use', { extensions: { code: 'UNIQUE_CONSTRAINT_VIOLATION', field: error.meta?.target } });
                }
                console.error("Error creating user:", error);
                throw new GraphQLError('Failed to create user', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
            }
            
        },

        signIn: async (_: any, args: { input: SignInInput }, context: MyContext) => {
            const validatedInput = SignInSchema.parse(args.input);
            const { email, password } = validatedInput;
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
            } catch (error: any) {
                if (error instanceof GraphQLError) {
                    throw error;
                }
                if (error instanceof ZodError) {
                    throw formatZodError(error);
                }
                console.error("Error during sign-in:", error);
                throw new GraphQLError('Authentication failed due to internal error', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
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
                if (error instanceof GraphQLError) {
                    throw error;
                }
                if (error instanceof ZodError) {
                    throw formatZodError(error);
                }
                console.error(`Error updating user with ID ${id}:`, error);
                if (error.code === 'P2025') {
                    throw new GraphQLError(`User with ID ${id} not found.`, { extensions: { code: 'NOT_FOUND', targetId: id } });
                }
                if (error.code === 'P2002') {
                    const targetField = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : error.meta?.target || 'unknown field';
                    throw new GraphQLError(`The provided ${targetField} is already in use by another user.`, { extensions: { code: 'UNIQUE_CONSTRAINT_VIOLATION', field: targetField }, });
                }
                throw new GraphQLError('Failed to update user.', { extensions: { code: 'INTERNAL_SERVER_ERROR', originalError: error.message || 'An unknown error occurred.' } });
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
                if (error instanceof GraphQLError) {
                    throw error;
                }
                if (error.code === 'P2025') {
                    throw new GraphQLError('User does not exist', { extensions: { code: 'NOT_FOUND', targetId: args.id } });
                } else {
                    console.error("Error deleting user:", error);
                    throw new GraphQLError('Unable to delete user', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
                }
            }
        }
    },


    User: {
        posts: async (parent: { id: string }, _: any, context: MyContext) => {
            try {
                return await context.prisma.post.findMany({
                    where: { authorId: parent.id },
                    select: {
                        id: true,
                        content: true,
                        imgUrl: true
                    }
                })
            } catch(error: any) {
                console.error(`Error fetching posts for user ID ${parent.id}:`, error);

                // Re-throw specific GraphQLError if it's already one (unlikely for Prisma errors here)
                if (error instanceof GraphQLError) {
                    throw error;
                }

                // For any other unexpected errors from Prisma/database
                throw new GraphQLError('Failed to fetch user posts', {
                    extensions: {
                        code: 'INTERNAL_SERVER_ERROR',
                        // Optionally include a more specific message if error.message is safe/useful,
                        // or just keep it generic for production.
                        originalError: error.message || 'An unexpected error occurred.'
                    }
                });
            }
            
        },

        // likes: async (parent: any, _:any, context: MyContext) => {
            
        // }
    }
}