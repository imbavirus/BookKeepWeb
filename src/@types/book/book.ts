import { z } from 'zod';
import { baseModelSchema } from '../baseModel';
import type { IBookFormValues } from './bookFormValues';

/**
 * Zod schema for validating book data.
 * Extends the `baseModelSchema` with book-specific fields and validation rules.
 */
export const bookSchema = baseModelSchema.extend({
    title: z.string().min(1, 'Title is required.').max(200, 'Title cannot be longer than 200 characters.'),
    author: z.string().min(1, 'Author is required.').max(100, 'Author name cannot be longer than 100 characters.'),
    isbn: z.string()
        .min(1, 'ISBN is required.')
        .min(10, 'ISBN must be between 10 and 13 characters.')
        .max(13, 'ISBN must be between 10 and 13 characters.')
        .regex(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/, 'Invalid ISBN format.'),
    description: z.string().max(2000, 'Description cannot be longer than 2000 characters.').optional().nullable(),
    publicationYear: z.number().int()
        .min(1000, 'Please enter a valid publication year.')
        .max(new Date().getFullYear() + 6, 'Please enter a valid publication year.')
        .optional().nullable(),
    genre: z.string().max(50, 'Genre cannot be longer than 50 characters.').optional().nullable(),
    coverImageUrl: z.string().url('Please enter a valid URL for the cover image.').max(500, 'Cover image URL cannot be longer than 500 characters.').optional().nullable(),
});

/**
 * Represents a book object, with its type inferred from the `bookSchema`.
 * This includes all properties from `IBaseModel` and book-specific fields.
 */
export type IBook = z.infer<typeof bookSchema>;

/**
 * Factory function to create and validate an `IBook` object from `IBookFormValues`.
 * @param {IBookFormValues} formValues - The form values to be parsed and validated against the `bookSchema`.
 * @returns {IBook} The validated book object.
 * @throws {Error} If validation fails, throws an error with details about the validation issues.
 */
export function Book(formValues : IBookFormValues) : IBook {
    try {
        return bookSchema.parse(formValues);
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Book validation failed: ${JSON.stringify(error.errors)}`);
        }
        throw new Error(`Book validation failed: ${error instanceof Error ? error.message : 'An unknown error occurred.'}`);
    }
};
