import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Container,
} from '@mui/material';
import { fetchBookById } from '../../services/bookService';
import type { IBook } from '../../@types/book/book';

const BookInfo = () => {
  const { id } = useParams<{ id : string }>(); // Get the 'id' parameter

  const { data: book, isLoading, isError, error, refetch } = useQuery<IBook, Error>({
    queryKey: ['book', id],
    queryFn: () => {
      if (!id) {
        // Should not happen if the route is matched correctly, but good for type safety
        return Promise.reject(new Error('Book ID is missing'));
      }
      return fetchBookById(id);
    },
    enabled: !!id, // Only run the query if id is available
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container sx={{ p: 2 }}>
        <Alert severity='error'>
          Error fetching book: {error?.message}
          <Button onClick={() => refetch()} sx={{ ml: 2 }}>Retry</Button>
        </Alert>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container sx={{ p: 2 }}>
        <Alert severity='warning'>Book not found.</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          {book.title}
        </Typography>
        <Grid container spacing={3}>
            <Card>
              <CardMedia
                component='img'
                height='auto'
                image={book.coverImageUrl || 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png'} // Placeholder if no image
                alt={book.title}
                sx={{ objectFit: 'contain', maxHeight: 450 }} // Ensures image fits well
              />
            </Card>
            <CardContent>
              <Typography variant='h6' component='h2'>Author: {book.author}</Typography>
              <Typography variant='body1' sx={{ mt: 1 }}><strong>ISBN:</strong> {book.isbn || 'N/A'}</Typography>
              <Typography variant='body1'><strong>Publication Year:</strong> {book.publicationYear || 'N/A'}</Typography>
              <Typography variant='body1'><strong>Genre:</strong> {book.genre || 'N/A'}</Typography>
              {book.description && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant='h6' component='h3'>Description:</Typography>
                  <Typography variant='body2' component='p'>{book.description}</Typography>
                </Box>
              )}
            </CardContent>
        </Grid>
      </Paper>
    </Container>
  );
};

export default BookInfo;
