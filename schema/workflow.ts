import {z} from 'zod';

export const createWorkflowSchema = z.object({
    name: z.string().min(3).max(80),
    description: z.string().min(3).max(200).optional(),
});