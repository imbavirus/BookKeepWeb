import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Book } from '../../../@types/book/book'; // Adjusted path
import { createBook } from '../../../services/bookService'; // Adjusted path
import { BookForm } from '../../../components/book/bookForm'; // Adjusted path
import { type IBookFormValues } from '../../../@types/book/bookFormValues'; // Adjusted path
import { forEach, isArray, isObject } from 'lodash-es';
import type { IApiError } from '../../../@types/apiError';

/**
 * Page component for creating a new book.
 * It utilizes the `BookForm` component for data input and handles the submission
 * to create a new book entry via the `createBook` service.
 */
export default function BookNewPage() {
  const [formSubmitting, setFormSubmitting] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Handles the closing of the form, typically by navigating back to the books list.
   */
  const onFormClose = () => {
    navigate('/books'); // Navigate to books list
  };

  /**
   * Handles the submission of the new book form.
   * It creates a new book using the `createBook` service and shows appropriate notifications.
   * @param {IBookFormValues} values - The validated form values for the new book.
   */
  const handleFormSubmit = async (values : IBookFormValues) => {
    setFormSubmitting(true);
    console.log('Form submitted for new book:', values);
    enqueueSnackbar('Creating book...', { variant: 'info' });
    try {
      console.log('Creating book with values:', values);
      // The Book factory function converts IBookFormValues to IBook
      // createBook expects the IBook object (or a DTO derived from it)
      const newBook = await createBook(Book(values));
      console.log('Created book:',newBook);
      if (newBook) {
        console.log('Book created successfully:', newBook);
        // onFormClose();
        // enqueueSnackbar('Book created successfully.', { variant: 'success' });
      } else {
        // This case might not be hit if createBook throws on failure
        console.error('Failed to create book: No data returned');
        enqueueSnackbar('Failed to create book.', { variant: 'error' });
      }
    } catch (error : unknown) {
      console.error('Error caught in handleFormSubmit:', error); // Log the raw error object

      // Check if it's an instance of our custom ApiError
      if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
        const apiError = error as unknown as IApiError; // Cast to IApiError
        enqueueSnackbar(apiError.message || 'Failed to create book. Please check details.', { variant: 'error' });

        if (apiError.errors) {
          if (isObject(apiError.errors) && !isArray(apiError.errors)) {
            // Case: Record<string, string[]> e.g., { fieldName: ["error1", "error2"] }
            forEach(apiError.errors as Record<string, string[]>, (messages, field) => {
              if (isArray(messages)) {
                messages.forEach(msg => {
                  console.error(`Validation Error (${field}): ${msg}`);
                  enqueueSnackbar(`${field}: ${msg}`, { variant: 'error' });
                });
              }
            });
          } else if (isArray(apiError.errors)) {
            // Case: string[] e.g., ["Global error 1", "Global error 2"]
            (apiError.errors as string[]).forEach(msg => {
              console.error(`Server Error: ${msg}`);
              enqueueSnackbar(msg, { variant: 'error' });
            });
          }
        } else {
          // No detailed errors, the main message from enqueueSnackbar above is primary.
          console.warn('ApiError caught, but no detailed "errors" field was present.');
        }
      } else {
        // Fallback for non-ApiError types
        console.error('An unexpected error occurred:', error);
        enqueueSnackbar('An unexpected error occurred. Please try again.', { variant: 'error' });
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div suppressHydrationWarning={true}>
        <BookForm
          onSubmit={handleFormSubmit}
          onCancel={onFormClose}
          isLoading={formSubmitting}
          submitButtonText='Create Book'
        />
    </div>
  );
}
