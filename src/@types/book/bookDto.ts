import { z } from 'zod';
import { bookSchema, type IBook } from './book';

/**
 * Zod schema for the Book Data Transfer Object (DTO).
 * This schema is derived from the main `bookSchema` but omits fields
 * that are typically managed by the backend or not sent during creation/update operations
 * (e.g., `id`, `createdOn`, `updatedOn`, `isActive`).
 */
export const bookDtoSchema = bookSchema.extend({
}).omit({
    id: true,
    createdOn: true,
    updatedOn: true,
    isActive: true,
});

/**
 * Represents the structure of a Book Data Transfer Object (DTO).
 * This type is inferred from `bookDtoSchema` and is used for data sent to or received from the API,
 * excluding certain backend-managed fields.
 */
export type IBookDto = z.infer<typeof bookDtoSchema>;

/**
 * Factory function to create and validate an `IBookDto` object from an `IBook` object.
 * It parses the input `book` against the `bookDtoSchema`.
 * @param {IBook} [book] - An optional `IBook` object to convert into a DTO.
 *                         If not provided, it attempts to parse an empty object, which may lead to validation errors.
 *                         Consider making the `book` parameter required for DTO creation.
 * @returns {IBookDto} The validated DTO object. Returns an empty object cast to `IBookDto` on error.
 * @throws {Error} Potentially, if parsing fails and error handling is modified to re-throw.
 */
export const BookDto = (book ?: IBook) : IBookDto => {
    try {
        if (!book) {
            // Note: Parsing an empty object might fail if bookDtoSchema has required fields (inherited from bookSchema).
            // A DTO is typically created from existing valid data.
            return bookDtoSchema.parse({});
        }
        return bookDtoSchema.parse(book); // `parse` will pick the fields defined in `bookDtoSchema`
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Book DTO creation/validation failed:', error.errors);
        } else {
            console.error('An unexpected error occurred during Book DTO creation:', error);
        }
        // Returning an empty object on error can hide issues.
        // Consider throwing the error or returning a more specific error state.
        return {} as IBookDto;
    }
};
