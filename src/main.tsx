import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  useRoutes,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import { CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import routes from '~react-pages';
import Navbar from './components/layout/navbar';

// Create a client instance
/**
 * React Query client instance with global default options.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global default options for queries
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
    },
  },
});

/**
 * Main application component.
 * It sets up the routing for the application using `useRoutes` and `Suspense` for lazy-loaded routes.
 * @returns {JSX.Element} The rendered application routes.
 */
function App() {
  return (
    <Suspense fallback={<CircularProgress size={20} color='inherit' />}>
      {useRoutes(routes)}
    </Suspense>
  );
}

/**
 * The root DOM element where the React application will be mounted.
 */
const app = createRoot(document.getElementById('root')!);

/**
 * Renders the main application structure into the DOM.
 * This includes setting up providers for state management (React Query), routing (BrowserRouter), UI components (Navbar), and notifications (SnackbarProvider).
 */
app.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <SnackbarProvider 
          maxSnack={3} 
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          autoHideDuration={3000}
          hideIconVariant={false}
          preventDuplicate
          dense
          action={(snackbarId) => (
            <IconButton
              onClick={() => closeSnackbar(snackbarId)}
              sx={{ color: 'white' }}
              size='small'
            >
              <CloseIcon />
            </IconButton>
          )}
        >
          <App />
        </SnackbarProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
