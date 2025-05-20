import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import type { MouseEvent } from 'react';
import {
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useState } from 'react';
import { fetchBooks, deleteBook } from '../../services/bookService';
import type { IBook } from '../../@types/book/book';
import BookTable from '../../components/book/bookTable';
import BookCardView from '../../components/book/bookCardView';

/**
 * Defines the possible view modes for displaying the list of books.
 * 'table': Displays books in a tabular format.
 * 'card': Displays books as individual cards.
 */
type ViewMode = 'table' | 'card';

/**
 * BookPage component displays a list of books.
 * It allows users to view books in either a table or card format,
 * add new books, edit existing ones, and delete books.
 * It handles data fetching, loading states, error states, and user interactions.
 */
const BookPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: books, isLoading, isError, error, refetch } = useQuery<IBook[], Error>({
    queryKey: ['books'],
    queryFn: fetchBooks,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  /** State to manage the current view mode ('table' or 'card'). */
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  /**
   * Handles the change in view mode.
   * @param {MouseEvent<HTMLElement>} _event - The mouse event that triggered the change.
   * @param {ViewMode | null} newViewMode - The new view mode selected by the user. If null, the mode is not changed.
   */
  const handleViewModeChange = (_event : MouseEvent<HTMLElement>, newViewMode : ViewMode | null) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const deleteMutation = useMutation({
    /**
     * The function that performs the delete operation.
     * @param {string} bookId - The ID of the book to delete.
     * @returns {Promise<any>} A promise that resolves when the book is deleted.
     *                       The actual return type depends on `deleteBook` service.
     */
    mutationFn: deleteBook,
    onSuccess: (deletedBookResponse) => { // The response from deleteBook is { id: string }
      // Find the book by its ID. Note: book.id is number, deletedBookResponse.id is string
      const deletedBookIdStr = deletedBookResponse?.id;
      const title = books?.find((book) => book.id.toString() === deletedBookIdStr)?.title;
      enqueueSnackbar(`Book "${title || 'Unknown'}" deleted successfully.`, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (err, deletedBookIdVariable) => { // deletedBookIdVariable is the string ID passed to mutate
      const title = books?.find((book) => book.id.toString() === deletedBookIdVariable)?.title;
      enqueueSnackbar(`Error deleting book "${title || 'Unknown'}": ${err.message}`, { variant: 'error' });
    },
  });

  /**
   * Handles the deletion of a book.
   * Prompts the user for confirmation before proceeding with the deletion.
   * @param {number} id - The numeric ID of the book to be deleted.
   */
  const handleDeleteBook = (id : number) => {
    const bookToDelete = books?.find(book => book.id === id);
    if (window.confirm(`Are you sure you want to delete the book "${bookToDelete?.title || 'this book'}"?`)) {
      deleteMutation.mutate(id.toString());
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity='error'>
          Error fetching books: {error?.message}
          <Button onClick={() => refetch()} sx={{ ml: 2 }}>Retry</Button>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      // This height assumes BookPage is rendered below a global AppBar of approx 128px.
      // Adjust '128px' if your AppBar height is different, or remove if no global AppBar.
      // If BookPage is nested within a layout that already manages height, you might use height: '100%'.
      height: 'calc(100vh - 128px)',
      p: 3, // Padding is applied within this Box
    }}>
      {/* Fixed Header Section */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h4' component='h1' sx={{ mr: 2 }}>
            Books
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label='view mode'
          >
            <ToggleButton value='table' aria-label='table view'>
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value='card' aria-label='card view'>
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box>
          <Button variant='contained' startIcon={<AddIcon />} onClick={() => navigate('/books/new')}>
            Add New Book
          </Button>
        </Box>
      </Box>

      {/* Scrollable Content Section */}
      <Box sx={{
        flexGrow: 1, // Allows this section to take up available vertical space
        overflowY: 'hidden', // hides overflow here
      }}>
        {viewMode === 'table' && (
          <BookTable
            books={books ?? []}
            deleteMutation={deleteMutation}
            handleDeleteBook={handleDeleteBook}
          />
        )}

        {viewMode === 'card' && (
          <BookCardView
            books={books ?? []}
            deleteMutation={deleteMutation}
            handleDeleteBook={handleDeleteBook}
          />
        )}
        {/* Optional: Display a message if there are no books after loading and no error */}
        {books && books.length === 0 && (
          <Typography sx={{ textAlign: 'center', mt: 4 }}>
            No books to display. Add a new book to get started!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BookPage;
