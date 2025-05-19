
import { v4 } from 'uuid';
import { z } from 'zod';

/**
 * Zod schema for the base model properties common to many entities.
 * This schema defines the structure and validation rules for these common fields.
 */
export const baseModelSchema = z.object({
    /**
     * The numeric primary key of the entity.
     * Defaults to 0 and must be a non-negative number.
     */
    id: z.number().min(0, 'ID is required').default(0),
    /**
     * A globally unique identifier (UUID v4) for the entity.
     * Defaults to a newly generated UUID.
     */
    guid: z.string().uuid().default(v4),
    /** Optional. The ISO date string when the entity was created. */
    createdOn: z.string().optional(),
    /** Optional. The ISO date string when the entity was last updated. */
    updatedOn: z.string().optional(),
    /**
     * Indicates whether the entity is active.
     * Defaults to true.
     */
    isActive: z.boolean().default(true),
});

/**
 * Represents the TypeScript type inferred from the `baseModelSchema`.
 * This type includes all properties defined in the base model schema.
 */
export type IBaseModel = z.infer<typeof baseModelSchema>;
