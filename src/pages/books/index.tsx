import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import type { MouseEvent } from 'react';
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
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { useState } from 'react';

import { fetchBooks, deleteBook } from '../../services/bookService';
import type { IBook } from '../../@types/book/book';

type ViewMode = 'table' | 'card';

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

  const [viewMode, setViewMode] = useState<ViewMode>('card');

  const handleViewModeChange = (_event : MouseEvent<HTMLElement>, newViewMode : ViewMode | null) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const deleteMutation = useMutation({
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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

      {viewMode === 'table' && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='books table'>
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
                  <TableCell component='th' scope='row'>
                    <Typography component={RouterLink} to={`/books/${book.id}`} color='primary' sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline'} }}>
                      {book.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.isbn || 'N/A'}</TableCell>
                  <TableCell>{book.publicationYear || 'N/A'}</TableCell>
                  <TableCell>{book.genre || 'N/A'}</TableCell>
                  <TableCell align='right'>
                    <IconButton onClick={() => navigate(`/books/${book.id}`)} color='default' aria-label='view book details'>
                      <InfoIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/books/edit/${book.id}`)} color='primary' aria-label='edit book'>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteBook(book.id)}
                      color='error'
                      aria-label='delete book'
                      disabled={deleteMutation.isPending && deleteMutation.variables === book.id.toString()}
                    >
                      {deleteMutation.isPending && deleteMutation.variables === book.id.toString() ? <CircularProgress size={20} /> : <DeleteIcon />}
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
      )}

      {viewMode === 'card' && (
        <Grid container spacing={3}>
          {books?.map((book) => (
            <Card key={book.id} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <RouterLink to={`/books/${book.id}`} style={{ textDecoration: 'none' }}>
                <CardMedia
                  component='img'
                  height='200'
                  image={book.coverImageUrl || 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'}
                  alt={book.title}
                    sx={{
                      width: '100%', // Ensure it takes the full width of the card
                      aspectRatio: '2/3', // Enforce a portrait book shape (width/height)
                      objectFit: 'contain', // Ensures the whole image fits, letterboxed if necessary
                      backgroundColor: (theme) => theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200], // Shows the defined aspect ratio box
                    }}
                />
              </RouterLink>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                  gutterBottom
                  variant='h6'
                  component='div'
                  noWrap
                >
                  {book.title}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Author: {book.author}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  ISBN: {book.isbn || 'N/A'}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Year: {book.publicationYear || 'N/A'}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', borderTop: '1px solid #eee', pt: 1 }}>
                <IconButton onClick={() => navigate(`/books/${book.id}`)} color='default' aria-label='view book details'>
                  <InfoIcon fontSize='small'/>
                </IconButton>
                <IconButton onClick={() => navigate(`/books/edit/${book.id}`)} color='primary' aria-label='edit book'>
                  <EditIcon fontSize='small'/>
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteBook(book.id)}
                  color='error'
                  aria-label='delete book'
                  disabled={deleteMutation.isPending && deleteMutation.variables === book.id.toString()}
                >
                  {deleteMutation.isPending && deleteMutation.variables === book.id.toString() ? <CircularProgress size={16} /> : <DeleteIcon fontSize='small'/>}
                </IconButton>
              </CardActions>
            </Card>
          ))}
          {(!books || books.length === 0) && (
                <Typography sx={{ textAlign: 'center', mt: 3, width: '100%' }}>
                    No books found.
                </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default BookPage;
