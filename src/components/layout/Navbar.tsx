import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import BookIcon from '@mui/icons-material/Book';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if we are on a page where a "Back" button should be shown
  const showBackButton =
    location.pathname.startsWith('/books/new') ||
    location.pathname.match(/^\/books\/edit\/.+/) || // Matches /books/edit/:id
    location.pathname.match(/^\/books\/(?!new|edit)[^/]+$/); // Matches /books/:id

  const handleBack = () => {
    navigate(-1); // Go back to the previous page in history
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        {showBackButton && (
          <IconButton color='inherit' onClick={handleBack} sx={{ mr: 2 }} aria-label='go back'>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Button
          color='inherit'
          component={RouterLink}
          to='/'
          sx={{ textTransform: 'none', justifyContent: 'flex-start', p: 0, '&:hover': { backgroundColor: 'transparent' } }}
          aria-label='Home'
        >
          <BookIcon sx={{ mr: 1 }} /> {/* Adjusted margin for icon within button */}
          <Typography variant='h6' component='div'>
            BookKeep
          </Typography>
        </Button>
        
        <span style={{ flexGrow: 1 }}></span>

        {/* This Box will now be pushed to the right by the flexGrow on the Button above */}
        <Box>
          <Button
            color='inherit'
            component={RouterLink}
            to='/books'
            sx={{ mr: 1 }}
          >
            Books
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
