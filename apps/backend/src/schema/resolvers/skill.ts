import { GraphQLError } from "graphql";
import { MyContext } from "../../server.js";


export const skillResolvers = {
    Query: {
        userSkills: async (_: any, __: any, context: MyContext) => {
            if (!context.userId) throw new GraphQLError("UNAUTHENTICATED!");

            try {
                const skills = await context.prisma.skill.findMany({
                    where: { userId: context.userId }
                })
                return skills;
            } catch (error) {
                throw new GraphQLError('Unable to fetch skills!')
            }
        }
    },

    Mutation: {
        addSkill: async (_: any, args: { newSkill: string }, context: MyContext) => {
            if (!context.userId) throw new GraphQLError("UNAUTHENTICATED!");

            try {
                const existingSkill = await context.prisma.skill.findUnique({
                    where: {
                        name_userId: {
                            name: args.newSkill,
                            userId: context.userId
                        }
                    }
                })
                if (existingSkill) {
                    throw new GraphQLError('Skill already exists');
                }
                await context.prisma.skill.create({
                    data: {
                        name: args.newSkill,
                        userId: context.userId
                    }
                })
                return true
            } catch (error) {
                throw new GraphQLError('Unable to add new skill');
            }
        },

        updateSkill: async (_: any, args: { id: string, updatedSkill: string }, context: MyContext) => {
            if (!context.userId) throw new GraphQLError("UNAUTHENTICATED!");
            try {
                const existingSkill = await context.prisma.skill.findUnique({
                    where: {
                        id: args.id
                        }
                })
                if (!existingSkill) {
                    throw new GraphQLError('Skill does not exist!');
                }
                if (existingSkill.userId !== context.userId) {
                    throw new GraphQLError('Unauthorized to update this skill');
                }
                await context.prisma.skill.update({
                    where: { id: args.id },
                    data: { name: args.updatedSkill }
                })
                return true;
            } catch (error) {
                throw new GraphQLError('Unable to update skill');
            }

        },

        deleteSkill: async (_: any, args: { id: string }, context: MyContext) => {
            if (!context.userId) throw new GraphQLError("UNAUTHENTICATED!");
            try {
                const existingSkill = await context.prisma.skill.findUnique({
                    where: {
                        id: args.id
                        }
                })
                if (!existingSkill) {
                    throw new GraphQLError('Skill does not exist!');
                }
                if (existingSkill.userId !== context.userId) {
                    throw new GraphQLError('Unauthorized to delete this skill');
                }
                await context.prisma.skill.delete({
                    where: { id: args.id }
                })
                return true;
            } catch (error) {
                throw new GraphQLError('Unable to delete skill');
            }

        }
    }
}