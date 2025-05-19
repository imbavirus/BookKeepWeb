import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { type IBook, Book } from '../../../@types/book/book';
import { fetchBookById, updateBook } from '../../../services/bookService';
import { BookForm } from '../../../components/book/bookForm';
import type { IBookFormValues } from '../../../@types/book/bookFormValues';
import { forEach } from 'lodash-es';
import type { IApiError } from '../../../@types/apiError';

export default function BookEditPage() {
  const { id } = useParams<{ id : string }>(); // Get the 'id' parameter for book
  const [book, setBook] = useState<IBook | undefined>();
  const [isLoading, setLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const loadBook = async () => {
      if (!id) {
        enqueueSnackbar('No book ID provided.', { variant: 'error' });
        navigate('/books'); // Navigate to books list if no ID
        return;
      }
      setLoading(true);
      try {
        // Assuming fetchBookById expects a string ID directly
        const fetchedBook = await fetchBookById(id);
        setBook(fetchedBook);
      } catch (error : unknown) {
        const apiError = error as IApiError;
        if (apiError.errors) {
            forEach(apiError.errors, (value, key) => {
              value.forEach(x => {
                console.log(`Error: ${key}: ${x}`, { variant: 'error' });
                enqueueSnackbar(`Error: ${key}: ${x}`, { variant: 'error' });
            });
          });

        } else {
          console.error('Error submitting form:', apiError.message);
          enqueueSnackbar(`Failed to update book: ${apiError.message}`, { variant: 'error' });
        }
        navigate('/books'); // Navigate away if book loading fails
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id, navigate, enqueueSnackbar]);

  const onFormClose = () => {
    navigate('/books'); // Navigate to books list
  };

  const handleFormSubmit = async (values : IBookFormValues) => {
    setFormSubmitting(true);
    enqueueSnackbar('Updating book...', { variant: 'info' });

    if (!book || !book.id) {
      enqueueSnackbar('Cannot update book without an ID.', { variant: 'error' });
      setFormSubmitting(false);
      return;
    }

    try {
      // The Book factory function converts IBookFormValues to IBook
      // updateBook expects the full IBook object including the ID for the payload
      const bookToUpdate = Book({ ...values, id: book.id, guid: book.guid }); // Ensure ID and guid are passed
      const updatedBook = await updateBook(bookToUpdate);
      if (updatedBook) {
        onFormClose();
        enqueueSnackbar('Book updated successfully.', { variant: 'success' });
      } else {
        // This case might not be hit if updateBook throws on failure
        console.error('Failed to update book: No data returned');
        enqueueSnackbar('Failed to update book.', { variant: 'error' });
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
        enqueueSnackbar(`Failed to update book: ${apiError.message}`, { variant: 'error' });
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  if (isLoading || !book) { // Show loading if still loading or if book is not yet defined
    return <div>Loading...</div>;
  }

  return (
      <BookForm
        defaultValues={book}
        onSubmit={handleFormSubmit}
        onCancel={onFormClose}
        isLoading={formSubmitting || isLoading}
        submitButtonText='Update Book'
      />
  );
}
