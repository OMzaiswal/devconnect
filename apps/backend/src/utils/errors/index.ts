import { GraphQLError } from "graphql";
import { ZodError } from "zod";

export function formatZodError(error: ZodError): GraphQLError {
    const errors: Record<string, string> = {};
    for (const issue of error.issues) {
        const field = issue.path.join('.') || 'general';
        errors[field] = issue.message;
    }
    return new GraphQLError("Validation failed", {
        extensions: {
            code: 'BAD_USER_INPUT',
            http: { status: 400 },
            validationErrors: errors,
        },
    });
}