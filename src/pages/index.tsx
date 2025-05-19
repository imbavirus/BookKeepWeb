import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

/**
 * HomePage component serves as the main landing page for the BookKeep application.
 * It provides a welcome message and navigation options to view existing books or add a new book.
 * @returns {JSX.Element} The rendered HomePage component.
 */
const HomePage = () => {
  /** Hook to programmatically navigate to different routes. */
  const navigate = useNavigate();

  return (
    <Container maxWidth='md' sx={{ mt: { xs: 4, sm: 8 }, mb: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 3, md: 6 }, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <AutoStoriesIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
        <Typography variant='h3' component='h1' gutterBottom>
          Welcome to BookKeep!
        </Typography>
        <Typography variant='h6' component='p' color='text.secondary' sx={{ mb: 4 }}>
          Your personal digital library. Keep track of all your favourite books.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', width: '100%' }}>
          <Button
            variant='contained'
            size='large'
            onClick={() => navigate('/books')}
            sx={{ minWidth: '180px' }}
          >
            View My Books
          </Button>
          <Button
            variant='outlined'
            size='large'
            onClick={() => navigate('/books/new')}
            sx={{ minWidth: '180px' }}
          >
            Add New Book
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default HomePage;
