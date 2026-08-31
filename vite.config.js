import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// SINGLEFILE=1 npm run build  ->  one self-contained dist/index.html (used for
// the hosted artifact). Default build is the normal code-split Vercel bundle.
const single = process.env.SINGLEFILE === '1';

export default defineConfig({
  plugins: [react(), ...(single ? [viteSingleFile()] : [])],
  build: {
    target: 'es2020',
    sourcemap: !single,
    cssCodeSplit: !single,
    assetsInlineLimit: single ? 100000000 : 4096,
    rollupOptions: single
      ? {}
      : {
          output: {
            // Keep the WebGL layer out of the critical bundle — it is lazy
            // imported and must not block first paint.
            manualChunks(id) {
              if (!id.includes('node_modules')) return undefined;
              if (/[\\/](three|@react-three)[\\/]/.test(id)) return 'three';
              if (/[\\/]gsap[\\/]/.test(id)) return 'gsap';
              if (/[\\/](react|react-dom|react-router|react-router-dom|framer-motion)[\\/]/.test(id))
                return 'react';
              return undefined;
            },
          },
        },
  },
});
