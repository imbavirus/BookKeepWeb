
import { v4 } from 'uuid';
import { z } from 'zod';

export const baseModelSchema = z.object({
    id: z.number().min(0, 'ID is required').default(0),
    guid: z.string().uuid().default(v4),
    createdOn: z.string().optional(),
    updatedOn: z.string().optional(),
});

// Infer the type from the schema
export type IBaseModel = z.infer<typeof baseModelSchema>;
