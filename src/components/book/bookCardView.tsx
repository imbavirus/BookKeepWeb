import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  IconButton,
  CircularProgress,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import type { UseMutationResult } from '@tanstack/react-query';
import type { IBook } from '../../@types/book/book';

/**
 * Props for the BookCardView component.
 */
interface IBookCardViewProps {
    /**
     * An array of book objects to display.
     */
    books : IBook[];
    /**
     * The mutation result object from React Query for the delete operation.
     * Used to determine loading state and potentially display errors for a specific book deletion.
     */
    deleteMutation : UseMutationResult<{
            id : string;
        }, Error, string, unknown>;
    /**
     * Callback function to handle the deletion of a book.
     * @param id - The ID of the book to delete.
     */
    handleDeleteBook : (id : number) => void;
}
/**
 * BookCardView component displays a grid of book cards.
 * Each card shows book details and actions like view, edit, and delete.
 */
const BookCardView = ({ books, deleteMutation, handleDeleteBook } : IBookCardViewProps) => {
    const navigate = useNavigate();
    return (
        // The grid container for the book cards
        // It uses Material-UI's Grid system to create a responsive layout
        // The spacing prop adds space between the grid items
        // The maxHeight and overflowY properties ensure that the grid is scrollable if it exceeds the viewport height
        <Grid container spacing={3} sx={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', paddingLeft: 2, paddingRight: 2, paddingTop: 5, paddingBottom: 5 }}>
            {books?.map((book) => (
            <Card key={book.id} sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '200px' }}>
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
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%'
                        }}
                    >
                        {book.title}
                    </Typography>
                    <Typography 
                        variant='body2' 
                        color='text.secondary'
                        noWrap
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%'
                        }}
                    >
                        Author: {book.author}
                    </Typography>
                    <Typography 
                        variant='body2' 
                        color='text.secondary'
                        noWrap
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%'
                        }}
                    >
                        ISBN: {book.isbn || 'N/A'}
                    </Typography>
                    <Typography 
                        variant='body2' 
                        color='text.secondary'
                        noWrap
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%'
                        }}
                    >
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
    );
};

export default BookCardView;
