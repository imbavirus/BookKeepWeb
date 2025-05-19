import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * Navbar component for the application.
 * Displays the application title, navigation links, and a conditional back button.
 * @returns {JSX.Element} The rendered Navbar component.
 */
export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Determines whether the "Back" button should be displayed based on the current route.
   * The back button is shown on:
   * - The new book page (`/books/new`)
   * - The edit book page (`/books/edit/:id`)
   * - The individual book details page (`/books/:id`, excluding 'new' or 'edit' subpaths)
   */
  const showBackButton =
    location.pathname.startsWith('/books/new') ||
    location.pathname.match(/^\/books\/edit\/.+/) || // Matches /books/edit/:id
    location.pathname.match(/^\/books\/(?!new|edit)[^/]+$/); // Matches /books/:id

  /**
   * Handles the click event for the back button.
   * Navigates to the previous page in the browser's history.
   */
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
          <AutoStoriesIcon sx={{ mr: 1 }} /> {/* Adjusted margin for icon within button */}
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
