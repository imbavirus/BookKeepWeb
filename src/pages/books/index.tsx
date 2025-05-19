import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';

import { fetchBooks, deleteBook } from '../../services/bookService';
import type { IBook } from '../../@types/book/book';

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

  const deleteMutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: (deletedBookId) => {
      const title = books?.find((book) => book.id === Number(deletedBookId?.id))?.title;
      enqueueSnackbar(`Book with Title: ${title} deleted successfully.`, { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (err, deletedBookId) => {
      const title = books?.find((book) => book.id === Number(deletedBookId))?.title;
      enqueueSnackbar(`Error deleting book with Title: ${title}: ${err.message}`, { variant: 'error' });
    },
  });

  const handleDeleteBook = (id : number) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteMutation.mutate(id?.toString());
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant='h4' component='h1'>
          Books
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => navigate('/books/new')}
        >
          Add New Book
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books?.map((book) => (
              <TableRow key={book.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component='th' scope='row'>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.isbn || 'N/A'}</TableCell>
                <TableCell>{book.publicationYear || 'N/A'}</TableCell>
                <TableCell>{book.genre || 'N/A'}</TableCell>
                <TableCell align='right'>
                  <IconButton onClick={() => navigate(`/books/${book.id}`)} color='primary' aria-label='book info'>
                    <InfoIcon />
                  </IconButton>
                  <IconButton onClick={() => navigate(`/books/edit/${book.id}`)} color='primary' aria-label='edit book'>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteBook(book.id)} color='error' aria-label='delete book' disabled={deleteMutation.isPending && Number(deleteMutation.variables) === book.id}>
                    {deleteMutation.isPending && Number(deleteMutation.variables) === book.id ? <CircularProgress size={20} /> : <DeleteIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {(!books || books.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  No books found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BookPage;
