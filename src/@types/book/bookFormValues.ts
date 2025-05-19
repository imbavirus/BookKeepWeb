import { z } from 'zod';
import { bookSchema, type IBook } from './book';

// Define the Zod schema for the form values
export const bookFormSchema = bookSchema.extend({
});

// Infer the TypeScript type from the Zod schema
export type IBookFormValues = z.infer<typeof bookFormSchema>;

// Factory function to create form values
export const BookFormValues = (book ?: IBook) : IBookFormValues => {
    // Handle the default case (new book)
    try {
        if (!book) {
            return bookFormSchema.parse({});
        }

        return bookFormSchema.parse({
            ...book,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('Book form validation failed:', error.errors);
        } else {
            console.error('An unexpected error occurred during validation:', error);
        }
        return {} as IBookFormValues;
    }
};

// Validation function using the Zod schema
export const validateBookForm = (formValues : IBookFormValues) : boolean => {
    try {
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
