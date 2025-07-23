import { z } from 'zod';

export const CreateUserSchema = z.object({
    name: z.string().min(2, 'Name is required').max(20, 'Name cannot exceed 20 characters').trim(),
    email: z.string().email('Invalid email format').trim(),
    password: z.string().min(8, 'Password must be at least 8 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contains at least one special character'),
    username: z.string().min(4, 'Username must be at least 4 characters long').max(12, 'Username cannot exceed 12 characters').trim()
    .regex(/^[A-Za-z0-9_.]+$/, 'Username can only contain letters, numbers, underscores and dot'),
    age: z.number().int().min(0, 'Age cannot be negative').max(110, 'Age cannot be greater than 110').optional(),
    gender: z.string().max(15, 'Gender cannot exceed characters').trim().optional(),
    bio: z.string().max(200, 'Bio cannot exceed 200 characters').trim().optional()
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
    name: z.string().min(2, 'Name is too short').max(20, 'Name cannot exceed 20 characters').trim().optional(),
    email: z.string().email('Invalid email format').trim().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters long.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contains at least one special character').optional(),
    username: z.string().min(4, 'Username must be at least 4 characters long').max(12, 'Username cannot exceed 12 characters').trim()
    .regex(/^[A-Za-z0-9_.]+$/, 'Username can only contain letters, numbers, underscores and dot').optional(),
    age: z.number().int().min(0, 'Age cannot be negative').max(110, 'Age cannot be greater than 110').optional(),
    gender: z.string().max(15, 'Gender cannot exceed characters').trim().optional(),
    bio: z.string().max(200, 'Bio cannot exceed 200 characters').trim().optional()
}).refine(data => {
    return Object.values(data).some(value => value !== undefined);
},{
    message: "At least one field must be provided for update.",
    path: ["input"],
})

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export const SignInSchema = z.object({
    email: z.string().email( "Invalid email format."),
    password: z.string().min(8, "Password is required."),
});
export type SignInInput = z.infer<typeof SignInSchema>;