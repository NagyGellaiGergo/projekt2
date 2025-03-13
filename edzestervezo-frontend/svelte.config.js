import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
  },
  // A vite konfiguráció a config.vite alatt van
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000', // Laravel backend címe
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  },
};

export default config;