import { z } from 'zod';

export const CreateUserSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[1-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contains at least one special character'),
    username: z.string().min(4, 'Username must be at least 4 characters long')
    .regex(/^[A-Za-z0-9_.]+$/, 'Username can only contain letters, numbers, underscores and dot'),
    age: z.number().int().min(0, 'Age cannot be negative').optional(),
    gender: z.string().max(15, 'Gender cannot exceed characters').optional(),
    bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional()
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
    name: z.string().min(2, 'Name is required').optional(),
    email: z.string().email('Invalid email format').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[1-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contains at least one special character').optional(),
    username: z.string().min(4, 'Username must be at least 4 characters long')
    .regex(/^[A-Za-z0-9_.]+$/, 'Username can only contain letters, numbers, underscores and dot').optional(),
    age: z.number().int().min(0, 'Age cannot be negative').optional(),
    gender: z.string().max(15, 'Gender cannot exceed characters').optional(),
    bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional()
})

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const SignInSchema = z.object({
    email: z.string().email( "Invalid email format."),
    password: z.string().min(6, "Password is required."),
});
export type SignInInput = z.infer<typeof SignInSchema>;