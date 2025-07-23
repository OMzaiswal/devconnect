import { z } from 'zod';

export const CreatePostSchema = z.object({
    content: z.string().min(1).max(500, 'Content is too long').trim(),
    imgUrl: z.string().url().optional()
})

export type CreatePostInput = z.infer<typeof CreatePostSchema>;

export const UpdatePostSchema = z.object({
    content: z.string().min(1).optional(),
    imgUrl: z.string().url().optional()
}).refine(data => data.content !== undefined || data.imgUrl !== undefined, {
    message: "At least one field (content or imgUrl) must be provided for update.",
    path: ["content", "imgUrl"],
}) ;


