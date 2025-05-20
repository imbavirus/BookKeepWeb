import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Typography,
} from '@mui/material';
import type { IBook } from '../../@types/book/book';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import type { UseMutationResult } from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Props for the BookTable component.
 */
interface IBookTableProps {
    /**
     * An array of book objects to display in the table.
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
 * BookTable component displays a list of books in a tabular format.
 * It provides actions to view, edit, and delete each book.
 */
const BookTable = ({ books, deleteMutation, handleDeleteBook } : IBookTableProps) => {
  const navigate = useNavigate();
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
          <Table sx={{ minWidth: 650 }} aria-label='books table'>
            <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1000 }}>
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
  );
};

export default BookTable;
