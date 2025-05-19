import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Book } from '../../../@types/book/book'; // Adjusted path
import { createBook } from '../../../services/bookService'; // Adjusted path
import { BookForm } from '../../../components/book/bookForm'; // Adjusted path
import { type IBookFormValues } from '../../../@types/book/bookFormValues'; // Adjusted path
import { forEach } from 'lodash-es';
import type { IApiError } from '../../../@types/apiError';

export default function BookNewPage() {
  const [formSubmitting, setFormSubmitting] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const onFormClose = () => {
    navigate('/books'); // Navigate to books list
  };

  const handleFormSubmit = async (values : IBookFormValues) => {
    setFormSubmitting(true);
    console.log('Form submitted for new book:', values);
    enqueueSnackbar('Creating book...', { variant: 'info' });
    try {
      // The Book factory function converts IBookFormValues to IBook
      // createBook expects the IBook object (or a DTO derived from it)
      const newBook = await createBook(Book(values));
      if (newBook) {
        onFormClose();
        enqueueSnackbar('Book created successfully.', { variant: 'success' });
      } else {
        // This case might not be hit if createBook throws on failure
        console.error('Failed to create book: No data returned');
        enqueueSnackbar('Failed to create book.', { variant: 'error' });
      }
    } catch (error : unknown) {
      const apiError = error as IApiError;
      if (apiError.errors) {
          forEach(apiError.errors, (value, key) => {
            value.forEach(x => {
              console.log(`Validation Error: ${key}: ${x}`, { variant: 'error' });
              enqueueSnackbar(`Validation Error: ${key}: ${x}`, { variant: 'error' });
          });
        });

      } else {
        console.error('Error submitting form:', apiError.message);
        enqueueSnackbar(`Failed to create book: ${apiError.message}`, { variant: 'error' });
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
