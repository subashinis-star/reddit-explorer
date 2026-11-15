import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/reddit-explorer/',
  plugins: [react()],

  server: {
    proxy: {
      '/reddit-api': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/reddit-api/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 RedditExplorer/1.0',
        },
      },
    },
  },
});