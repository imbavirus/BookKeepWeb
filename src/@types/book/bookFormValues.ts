import { z } from 'zod';
import { bookSchema, type IBook } from './book';

/**
 * Zod schema specifically for validating book form values.
 * It extends the base `bookSchema` and can include form-specific transformations or overrides if needed.
 * Currently, it directly uses `bookSchema`.
 */
export const bookFormSchema = bookSchema.extend({
});

/**
 * Represents the shape of the data expected and managed by the book form.
 * Type inferred from `bookFormSchema`.
 */
export type IBookFormValues = z.infer<typeof bookFormSchema>;

/**
 * Factory function to create or initialize `IBookFormValues`.
 * If a `book` object is provided, it attempts to parse it into `IBookFormValues`.
 * If no `book` is provided (e.g., for a new book form), it attempts to parse an empty object,
 * which might lead to validation errors if `bookFormSchema` has required fields without defaults.
 * Consider providing default empty values for a new form to avoid initial validation errors.
 * @param {IBook} [book] - An optional existing book object to initialize the form values from.
 * @returns {IBookFormValues} The initialized or parsed book form values. Returns an empty object cast to `IBookFormValues` on error.
 */
export const BookFormValues = (book ?: IBook) : IBookFormValues => {
    // Handle the default case (new book)
    try {
        if (!book) {
            // Note: Parsing an empty object might fail if bookFormSchema has required fields.
            // Consider returning a structure with default empty values for a new form.
            return bookFormSchema.parse({});
        }

        return bookFormSchema.parse({
            ...book,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('BookFormValues creation/validation failed:', error.errors);
        } else {
            console.error('An unexpected error occurred during BookFormValues creation:', error);
        }
        // Returning an empty object on error might hide issues.
        // Consider throwing the error or returning a more specific error state.
        return {} as IBookFormValues;
    }
};

// Validation function using the Zod schema
export const validateBookForm = (formValues : IBookFormValues) : boolean => {
    try {
        /**
         * Validates the provided book form values against the `bookFormSchema`.
         * Logs errors to the console if validation fails.
         * @param {IBookFormValues} formValues - The book form values to validate.
         * @returns {boolean} True if validation is successful, false otherwise.
         */
        bookFormSchema.parse(formValues);
        return true;
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Book form validation failed:', error.errors);
        } else {
            console.error('An unexpected error occurred during validation:', error);
        }
        return false;
    }
};
