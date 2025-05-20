import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import Pages from 'vite-plugin-pages';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    Pages({
      dirs: 'src/pages',
      extensions: ['tsx'],
    }),
    react(),
  ],
  preview: {
    allowedHosts: [
      'bookkeep-web.home.infernos.co.za',
      // You can add more allowed hosts here if needed
    ],
  },
});
