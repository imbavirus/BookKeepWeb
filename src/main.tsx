import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter,
  useRoutes,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


import routes from '~react-pages';
import { SnackbarProvider } from 'notistack';
import Navbar from './components/layout/navbar';

// Create a client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Global default options for queries
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
    },
  },
});

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {useRoutes(routes)}
    </Suspense>
  );
}

const app = createRoot(document.getElementById('root')!);

app.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <App />
        </SnackbarProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
